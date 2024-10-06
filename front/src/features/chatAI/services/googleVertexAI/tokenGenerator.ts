export class TokenGenerator {
    static async generate({clientEmail, privateKey, scope}) {
        const header = {
            alg: 'RS256',
            typ: 'JWT',
        }

        const now = Math.floor(Date.now() / 1000)
        const claimSet = {
            iss: clientEmail,
            scope: scope,
            aud: 'https://oauth2.googleapis.com/token',
            exp: now + 3600,
            iat: now,
        }

        const encodedHeader = TokenGenerator.#base64url(
            new TextEncoder().encode(JSON.stringify(header))
        )
        const encodedClaimSet = TokenGenerator.#base64url(
            new TextEncoder().encode(JSON.stringify(claimSet))
        )

        const signature = await TokenGenerator.#signJWT(
            encodedHeader,
            encodedClaimSet,
            privateKey
        )
        const jwt = `${encodedHeader}.${encodedClaimSet}.${signature}`

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
        })

        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(
                `Token Generate Failed : HTTP Error(${response.status})`
            )
        }

        const data = await response.json()
        const accessToken = data.access_token;

        if (!accessToken) {
            // Handle missing access token
            throw new Error('Token Generate Failed : Fail to get token')
        }

        return accessToken
    }

    
    static #base64url(source) {
        // Encode in classical base64
        let encodedSource = btoa(
            //@ts-ignore
            String.fromCharCode.apply(null, new Uint8Array(source))
        )

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '')

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-')
        encodedSource = encodedSource.replace(/\//g, '_')

        return encodedSource
    }

    static async #signJWT(header, claimSet, privateKey) {
        const encoder = new TextEncoder()
        const data = encoder.encode(`${header}.${claimSet}`)

        const key = await crypto.subtle.importKey(
            'pkcs8',
            TokenGenerator.#str2ab(privateKey),
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: { name: 'SHA-256' },
            },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            key,
            data
        )

        return TokenGenerator.#base64url(new Uint8Array(signature))
    }

    static #str2ab(str) {
        const binaryString = atob(
            str.replace(
                /-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\\n/g,
                ''
            )
        )
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes.buffer
    }
}