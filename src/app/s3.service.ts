import { Injectable } from "@angular/core"
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { environment } from "../environments/environment"
import { AuthService } from "./auth.service"

@Injectable({ providedIn: 'root' })
export class S3Service {

    bucketName = 'oscar-cunha-photo-upload'
    s3Client!: S3Client

    constructor(private authService: AuthService) {
        this.authService.session$.subscribe(() => {
            this.s3Client = new S3Client({
                region: environment.s3Region, credentials: fromCognitoIdentityPool({
                    identityPoolId: this.authService.IDENTITY_POOL_ID,
                    clientConfig: { region: environment.s3Region },
                    logins: {
                        [this.authService.COGNITO_ID]: this.authService.session?.idToken ?? ''
                    }
                })
            })
        })
    }

    async listBucket() {
        return this.s3Client.send(new ListObjectsV2Command({ Bucket: this.bucketName, FetchOwner: true, OptionalObjectAttributes: ["RestoreStatus"] }))
    }

    async getObjectUrl(key: string) {
        return this.getSignedUrl(new GetObjectCommand({ Bucket: this.bucketName, Key: key }))
    }

    async uploadObject(file: File) {
        const command = new PutObjectCommand({ Bucket: this.bucketName, Key: file.name, Body: file })

        return this.s3Client.send(command)

    }

    private getSignedUrl(command: any) {
        return getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
    }

}