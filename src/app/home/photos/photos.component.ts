import { AsyncPipe, DatePipe, DOCUMENT, NgFor, NgIf } from '@angular/common'
import { Component, Inject } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { FileUploadErrorEvent, FileUploadModule } from 'primeng/fileupload'
import { TableModule } from 'primeng/table'
import { PhotoService, S3ObjectInterface } from './photo.services'


@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [NgFor, TableModule, DatePipe, NgIf, ButtonModule, AsyncPipe, FileUploadModule],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosComponent {

  state$ = this.photoService.state$
  private window!: Window

  constructor(private photoService: PhotoService, @Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView!
  }

  ngOnInit() {
    this.photoService.getPhotos()
  }

  openObject(object: S3ObjectInterface) {
    const url = this.photoService.getPhotoUrl(object).then((url) => {
      this.window.open(url, '_blank')
    })
  }

  onUpload(event: FileUploadErrorEvent) {
    if(event.files) {
      this.photoService.uploadPhoto(event.files[0])
    }
  }

}
