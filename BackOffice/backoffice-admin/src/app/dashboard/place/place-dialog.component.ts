import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getApiUrl, getMediaServiceUrl } from '../../config/api.config';

@Component({
  selector: 'app-place-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Editar' : 'Agregar' }} Lugar Turístico</h2>
    <div class="dialog-content">
    <form [formGroup]="lugarForm" (ngSubmit)="onSubmit()" class="user-form-modal">
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="name" required />
      </mat-form-field>
      
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="description" required rows="3"></textarea>
      </mat-form-field>
      
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Ubicación</mat-label>
        <input matInput formControlName="location" required />
      </mat-form-field>
      
      <mat-form-field appearance="outline" color="primary">
        <mat-label>Categoría</mat-label>
        <mat-select formControlName="category">
          <mat-option value="">Sin categoría</mat-option>
          <mat-option value="Playa">Playa</mat-option>
          <mat-option value="Montaña">Montaña</mat-option>
          <mat-option value="Río">Río</mat-option>
          <mat-option value="Parque">Parque</mat-option>
          <mat-option value="Museo">Museo</mat-option>
          <mat-option value="Restaurante">Restaurante</mat-option>
          <mat-option value="Hotel">Hotel</mat-option>
          <mat-option value="Otro">Otro</mat-option>
        </mat-select>
      </mat-form-field>
      
      <mat-form-field appearance="outline" color="primary">
        <mat-label>URL de Imagen de Portada</mat-label>
        <input matInput formControlName="coverImageUrl" placeholder="https://ejemplo.com/imagen.jpg" autocomplete="off" />
        <mat-hint *ngIf="!lugarForm.get('coverImageUrl')?.value">URL de la imagen principal del lugar</mat-hint>
      </mat-form-field>
      
      <div class="image-urls-section">
        <label class="section-label">URLs de Imágenes Adicionales</label>
        <div class="url-input-container">
          <input 
            #urlInput
            type="text" 
            placeholder="https://ejemplo.com/imagen.jpg"
            (keyup.enter)="addImageUrl(urlInput.value); urlInput.value = ''"
            class="url-input"
          />
          <button 
            type="button" 
            mat-mini-fab 
            color="primary" 
            (click)="addImageUrl(urlInput.value); urlInput.value = ''"
            class="add-url-btn"
          >
            <mat-icon>add</mat-icon>
          </button>
        </div>
        
        <div class="url-chips" *ngIf="imageUrls.length > 0">
          <mat-chip 
            *ngFor="let url of imageUrls; let i = index" 
            (removed)="removeImageUrl(i)"
            class="url-chip"
          >
            {{ url.length > 30 ? url.substring(0, 30) + '...' : url }}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
        </div>
      </div>
      
      <div class="local-images-section">
        <label class="section-label">Subir Imágenes Locales</label>
        <div class="file-upload-container">
          <input 
            #fileInput
            type="file" 
            multiple 
            accept="image/*"
            (change)="onFileSelected($event)"
            class="file-input"
            [disabled]="isUploading"
          />
          <button 
            type="button" 
            mat-raised-button 
            color="primary" 
            (click)="fileInput.click()"
            [disabled]="isUploading"
            class="upload-btn"
          >
            <mat-icon>cloud_upload</mat-icon>
            Seleccionar Imágenes
          </button>
        </div>
        
        <div *ngIf="isUploading" class="upload-progress">
          <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
          <span class="progress-text">Subiendo imágenes... {{ uploadProgress }}%</span>
        </div>
        
        <div class="uploaded-images" *ngIf="uploadedImages.length > 0">
          <div class="image-preview" *ngFor="let image of uploadedImages; let i = index">
            <img [src]="getImageUrl(image.url)" [alt]="image.originalName" class="preview-img">
            <div class="image-info">
              <span class="image-name">{{ image.originalName }}</span>
              <button 
                type="button" 
                mat-icon-button 
                color="warn" 
                (click)="removeUploadedImage(i)"
                class="remove-btn"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
          <button mat-raised-button color="primary" type="submit">{{ isEditing ? 'Actualizar' : 'Agregar' }}</button>
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
      </div>
    </form>
    </div>
  `,
  styles: [`
    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
      padding-right: 8px;
    }
    
    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }
    
    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
    
    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    
    .user-form-modal {
      display: flex;
      flex-direction: column;
      gap: 22px;
      min-width: 400px;
      max-width: 500px;
      margin: 0 auto;
      background: #f8f9fa;
      border-radius: 14px;
      padding: 28px 24px 18px 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    }
    .modal-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 18px;
    }
    h2[mat-dialog-title] {
      text-align: center;
      font-size: 1.35rem;
      font-weight: 600;
      margin-bottom: 10px;
      color: #1e3c72;
    }
    mat-form-field {
      width: 100%;
    }
    ::ng-deep .user-form-modal input,
    ::ng-deep .user-form-modal textarea,
    ::ng-deep .user-form-modal .mat-input-element,
    ::ng-deep .user-form-modal .mat-form-field-label {
      color: #111 !important;
      background: #fff !important;
      caret-color: #111 !important;
    }
    button[mat-raised-button] {
      min-width: 110px;
      font-weight: 500;
    }
    button[mat-button] {
      font-weight: 400;
    }
    
    .image-urls-section {
      margin-top: 16px;
    }
    
    .section-label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #333;
      font-size: 14px;
    }
    
    .url-input-container {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .url-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .add-url-btn {
      width: 36px;
      height: 36px;
    }
    
    .url-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .url-chip {
      max-width: 200px;
    }
    
    .local-images-section {
      margin-top: 16px;
    }
    
    .file-upload-container {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .file-input {
      display: none;
    }
    
    .upload-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .upload-progress {
      margin-bottom: 12px;
    }
    
    .progress-text {
      display: block;
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    
    .uploaded-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    
    .image-preview {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background: #f9f9f9;
    }
    
    .preview-img {
      width: 100%;
      height: 80px;
      object-fit: cover;
    }
    
    .image-info {
      padding: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .image-name {
      font-size: 11px;
      color: #666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 80px;
    }
    
    .remove-btn {
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
  `]
})
export class PlaceDialogComponent {
  lugarForm: FormGroup;
  isEditing = false;
  imageUrls: string[] = [];
  uploadedImages: any[] = [];
  isUploading = false;
  uploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlaceDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.lugarForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      category: [''],
      coverImageUrl: ['']
    });

    // Si se pasan datos, es modo edición
    if (data) {
      this.isEditing = true;
      this.imageUrls = data.imageUrls || [];
      this.lugarForm.patchValue({
        name: data.name || '',
        description: data.description || '',
        location: data.location || '',
        category: data.category || '',
        coverImageUrl: data.coverImageUrl || ''
      });
    }
  }

  addImageUrl(url: string) {
    if (url && url.trim()) {
      this.imageUrls.push(url.trim());
    }
  }

  removeImageUrl(index: number) {
    this.imageUrls.splice(index, 1);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadFiles(files);
    }
  }

  async uploadFiles(files: FileList) {
    this.isUploading = true;
    this.uploadProgress = 0;

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('imagenes', files[i]);
      }

      // Forzar el envío del token JWT en la cabecera Authorization
      const token = localStorage.getItem('token');
      const httpHeaders = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

      const response: any = await this.http.post(
        getMediaServiceUrl('/media/upload'),
        formData,
        { headers: httpHeaders }
      ).toPromise();
      
      if (response.success) {
        this.uploadedImages.push(...response.files);
        this.uploadProgress = 100;
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  getImageUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return getApiUrl(url);
  }

  removeUploadedImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  onSubmit() {
    if (this.lugarForm.invalid) return;
    
    const formData = this.lugarForm.value;
    formData.imageUrls = this.imageUrls;
    
    // Agregar URLs de imágenes subidas localmente
    if (this.uploadedImages.length > 0) {
      const uploadedUrls = this.uploadedImages.map(img => this.getImageUrl(img.url));
      formData.imageUrls = [...formData.imageUrls, ...uploadedUrls];
    }
    
    this.dialogRef.close(formData);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
} 