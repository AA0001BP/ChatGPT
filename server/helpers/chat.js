import { db } from "../db/connection.js";
import collections from "../db/collections.js";
import { ObjectId } from "mongodb";

export default {
    newResponse: (prompt, { hixai }, userId) => {
        return new Promise(async (resolve, reject) => {
            let chatId = new ObjectId().toHexString()
            let res = null
            try {
                await db.collection(collections.CHAT).createIndex({ user: 1 }, { unique: true })
                res = await db.collection(collections.CHAT).insertOne({
                    user: userId.toString(),
                    data: [{
                        chatId,
                        chats: [{
                            prompt,
                            content: hixai
                        }]
                    }]
                })
            } catch (err) {
                if (err?.code === 11000) {
                    res = await db.collection(collections.CHAT).updateOne({
                        user: userId.toString(),
                    }, {
                        $push: {
                            data: {
                                chatId,
                                chats: [{
                                    prompt,
                                    content: hixai
                                }]
                            }
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            } finally {
                if (res) {
                    res.chatId = chatId
                    resolve(res)
                } else {
                    reject({ text: "DB gets something wrong" })
                }
            }
        })
    },
    updateChat: (chatId, prompt, { hixai }, userId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).updateOne({
                user: userId.toString(),
                'data.chatId': chatId
            }, {
                $push: {
                    'data.$.chats': {
                        prompt,
                        content: hixai
                    }
                }
            }).catch((err) => {
                reject(err)
            })

            if (res) {
                resolve(res)
            } else {
                reject({ text: "DB gets something wrong" })
            }
        })
    },
    getChat: (userId, chatId) => {
        return new Promise(async (resolve, reject) => {
            let res = await db.collection(collections.CHAT).aggregate([
                {
                    $match: {
                        user: userId.toString()
                    }
                }, {
                    $unwind: '$data'
                }, {
                    $match: {
                        'data.chatId': chatId
                    }
                }, {
                    $project: {
                        _id: 0,
                        chat: '$data.chats'
                    }
                }
            ]).toArray().catch((err) => [
                reject(err)
            ])

            if (res && Array.isArray(res) && res[0]?.chat) {
                resolve(res[0].chat)
            } else {
                reject({ status: 404 })
            }
        })
    },
    getHistory: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.collection(collections.CHAT).aggregate([
                    {
                        $match: {
                            user: userId.toString()
                        }
                    },
                    {
                        $unwind: "$data"
                    },
                    {
                        $sort: { "data.chatId": -1 } // Sort first to get latest messages
                    },
                    {
                        $limit: 10
                    },
                    {
                        $project: {
                            _id: 0,
                            chatId: "$data.chatId",
                            prompt: {
                                $arrayElemAt: ['$data.chats.prompt', 0]
                            },
                            messages: "$data.chats" // Return full chat history (not just the first message)
                        }
                    }
                ]).toArray();

                resolve(res);
            } catch (err) {
                reject({ text: "DB Getting Some Error", error: err });
            }
        });
    },
    deleteAllChat: (userId) => {
        return new Promise((resolve, reject) => {
            db.collection(collections.CHAT).deleteOne({
                user: userId.toString()
            }).then((res) => {
                if (res?.deletedCount > 0) {
                    resolve(res)
                } else {
                    reject({ text: 'DB Getting Some Error' })
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },
    convertChatHistory(chatData) {
        let history = [];
        
        chatData.forEach(entry => {
            history.push({ role: "user", content: entry.prompt });
            history.push({ role: "assistant", content: entry.content });
        });
        
        return history;
    }
}