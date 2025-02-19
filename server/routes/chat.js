import { Router } from "express";
import dotnet from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";

dotnet.config()

let router = Router()

const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

router.get('/', (req, res) => {
    res.send("Welcome to chatGPT api v1")
})

router.post('/', CheckUser, async (req, res) => {
    const { prompt, userId } = req.body

    let response = {}

    try {
        response.openai = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0.2,
            presence_penalty: 0,
        });
        console.log("OpenAI Response:", response.openai);
        if (response?.openai?.data?.choices?.[0]?.message?.content) {
            // Get the content from OpenAI response
            response.openai = response.openai.data.choices[0].message.content;
            console.log("Get the content from OpenAI response:", response.openai);
            
            // Remove up to two leading newlines
            response.openai = response.openai.replace(/^\n{0,2}/, '');
            console.log("Remove up to two leading newlines:", response.openai);
            
            // Save the response to the database
            response.db = await chat.newResponse(prompt, response, userId);
            console.log("Save the response to the database:", response.db);
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    _id: response.db['chatId'],
                    content: response.openai
                }
            })
        }
    }
})

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId } = req.body

    let response = {}

    try {
        response.openai = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0.2,
            presence_penalty: 0,
        });

        if (response?.openai?.data?.choices?.[0]?.message?.content) {
            response.openai = response.openai.data.choices[0].message.content;
            response.openai = response.openai.replace(/^\n{0,2}/, '');
            response.db = await chat.updateChat(chatId, prompt, response, userId)
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.openai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response.openai
                }
            })
        }
    }
})

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { chatId = null } = req.query

    let response = null

    try {
        response = await chat.getChat(userId, chatId)
    } catch (err) {
        if (err?.status === 404) {
            res.status(404).json({
                status: 404,
                message: 'Not found'
            })
        } else {
            res.status(500).json({
                status: 500,
                message: err
            })
        }
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: response
            })
        }
    }
})

router.get('/history', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.getHistory(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})

router.delete('/all', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.deleteAllChat(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})

export default router