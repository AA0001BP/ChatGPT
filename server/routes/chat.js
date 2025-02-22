import { Router } from "express";
import dotnet from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";
import axios from 'axios'

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

const obtainResponse = async (task_id) => {
    try {
        const response = await axios.get(`https://bypass.hix.ai/api/hixbypass/v1/obtain?task_id=${task_id}`, {
            headers: {
                'api-key': process.env.HIX_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        const { err_code, data } = response.data
        if (err_code !== 0) throw new Error("Something went wrong. Please try again later.")
        if (!data.task_status) {
            return obtainResponse(task_id)
        }
        else {
            return data
        }
    } catch (error) {
        console.error('Error in Hix API:', error);
        throw error;
    }
}
// Function to send data to Hix API
const processWithHixAPI = async (text) => {
    try {
        if (text.split(" ").length < 50) throw new Error("Text is too short for humanization")
        const submitTask = await axios.post('https://bypass.hix.ai/api/hixbypass/v1/submit', {
            input: text,
            mode: "latest"
        }, {
            headers: {
                'api-key': process.env.HIX_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log("submitTask:", submitTask);
        const task_id = submitTask.data.data.task_id // collect the task_id from bypass
        const data = await obtainResponse(task_id)
        return data
    } catch (error) {
        console.error('Error in Hix API:', error);
        throw error;
    }
};


router.get('/', (req, res) => {
    res.send("Welcome to EssayAI api v1")
})

router.post('/', CheckUser, async (req, res) => {
    const { prompt, userId, isHumanize = false } = req.body

    let response = {}
    let content = isHumanize ? prompt : `Write an essay for more than 50 words based on the given prompt after this. ${prompt}`

    try {
        if (isHumanize) {
            response.data = await processWithHixAPI(prompt);
            response.hixai = response.data.output.replace(/^\n{0,2}/, '');
            // Save the response to the database
            response.db = await chat.newResponse(prompt, response, userId);
        }
        else {
            response.openai = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content }],
                temperature: 0,
                max_tokens: 500,
                top_p: 1,
                frequency_penalty: 0.2,
                presence_penalty: 0,
            });
            if (response?.openai?.data?.choices?.[0]?.message?.content) {
                // Get the content from OpenAI response
                response.openai = response.openai.data.choices[0].message.content;
                response.openai = response.openai.replace(/^\n{0,2}/, '');
                response.data = await processWithHixAPI(response.openai);

                response.hixai = response.data.output.replace(/^\n{0,2}/, '');
                response.db = await chat.newResponse(prompt, response, userId);
            }
        }
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.hixai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    _id: response.db['chatId'],
                    isHumanize,
                    content: response.hixai,
                    data: response.data
                }
            })
        }
    }
})

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId, isHumanize = false } = req.body

    let response = {}
    let messages = [{ role: "user", content: prompt }]
    try {
        const savedChat = await chat.getChat(userId, chatId)
        console.log("savedChat:", savedChat);
        if (savedChat) {
            const history = await chat.convertChatHistory(savedChat)
            messages = [...messages, ...history]
        }
        if (isHumanize) {
            response.data = await processWithHixAPI(prompt);
            response.hixai = response.data.output.replace(/^\n{0,2}/, '');
            response.db = await chat.newResponse(prompt, response, userId);
        }
        else {
            response.openai = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages,
                temperature: 0.7,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0.2,
                presence_penalty: 0,
            });

            if (response?.openai?.data?.choices?.[0]?.message?.content) {
                response.openai = response.openai.data.choices[0].message.content;
                response.openai = response.openai.replace(/^\n{0,2}/, '');

                response.data = await processWithHixAPI(response.openai, isHumanize);

                response.hixai = response.data.output.replace(/^\n{0,2}/, '');

                response.db = await chat.updateChat(chatId, prompt, response, userId)
            }
        }
    } catch (err) {
        console.log("Error in chat.js:", err);
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response?.db && response?.hixai) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: {
                    content: response.hixai,
                    isHumanize,
                    data: response.data,
                    message: response.data.error_message || 'No error'
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