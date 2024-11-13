import { RequestForm, MODELS, ChatRole } from '../'
import { user, bot, system } from './message'
import { GoogleGeminiAPI } from '../models'

const geminiAPI = new GoogleGeminiAPI();

describe('transform RequestForm', () => {
    const testForm:RequestForm = {
        model: MODELS.CLAUDE,
        model_detail: 'model-name',
        secret : {
            api_key : 'api-key',
        },
        temperature: 1.0,
        max_tokens: 512,
        top_p: 1.0,
        message : [
            system('system-message'),
            user('user-message'),
            bot('bot-message')
        ]
    };
    const [testFormUrl, testFormData] = geminiAPI.makeRequestData(testForm);

    test('valid url', async () => {
        // URL에 API키와 모델명이 포함됨
        const expected = 'https://generativelanguage.googleapis.com/v1beta/models/model-name:generateContent?key=api-key';
        expect(testFormUrl).toBe(expected);
    });
    test('valid body', async () => {
        // system이 존재하지 않아 MODEL로 대체됨
        const expected = {
            contents: [
                {
                    role : 'MODEL',
                    parts: [
                        {
                            text: 'system-message'
                        }
                    ]
                },
                {
                    role : 'USER',
                    parts: [
                        {
                            text: 'user-message'
                        }
                    ]
                },
                {
                    role : 'MODEL',
                    parts: [
                        {
                            text: 'bot-message'
                        }
                    ]
                },
            ],
            generation_config : {
                maxOutputTokens : 512,
                temperature : 1.0,
                topP: 1.0,
            },
            safetySettings : expect.any(Object)
        }
        const actual = JSON.parse(testFormData.body);
        expect(actual).toEqual(expected);
    });
    test('valid header', async () => {
        const expected = {
            'Content-Type': 'application/json'
        }
        const actual = testFormData.headers;
        expect(actual).toEqual(expected);
    });
});