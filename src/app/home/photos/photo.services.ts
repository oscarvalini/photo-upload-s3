import { Injectable } from "@angular/core";
import { PhotosComponent } from "./photos.component";
import { S3Service } from "../../s3.service";
import { BehaviorSubject } from "rxjs";

export interface S3ObjectInterface {
    key: string;
    owner: string;
    lastModified: Date;
    size: number;
    class: string;
}

export interface PhotosState {
    photos: Partial<S3ObjectInterface>[]; loading: boolean, files: File[];
}

@Injectable({ providedIn: 'root' })
export class PhotoService {

    objects: Array<Partial<S3ObjectInterface>> = [];
    stateSubject$ = new BehaviorSubject<PhotosState>({ photos: this.objects, loading: true, files: [] });
    state$ = this.stateSubject$.asObservable();


    constructor(private s3Client: S3Service) { }

    getPhotos() {
        this.s3Client.listBucket().then((res) => {
            if (res.Contents) {
                const objects = res.Contents.map(({ Key, Owner, LastModified, Size, StorageClass }) => (
                    { key: Key, lastModified: LastModified, owner: Owner?.DisplayName, size: Size, class: StorageClass?.toString() }))

                this.stateSubject$.next({ loading: false, photos: objects, files: [] })
            }
        })
    }

    getPhotoUrl(photo: S3ObjectInterface) {
        return this.s3Client.getObjectUrl(photo.key);
    }

    async uploadPhoto(file: File) {
        this.stateSubject$.next({ ...this.stateSubject$.value, loading: true });
        return this.s3Client.uploadObject(file).then((res) => {

            alert('sucesso');
            this.getPhotos();
        });
    }

}