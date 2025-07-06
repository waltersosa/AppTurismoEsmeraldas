import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PlaceDialogComponent } from './place-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getApiUrl } from '../../config/api.config';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <h1>Lugares Turísticos</h1>
    <div style="display: flex; gap: 18px; margin-bottom: 16px; align-items: flex-end;">
      <mat-form-field appearance="outline">
        <mat-label>Filtrar por nombre</mat-label>
        <input matInput [formControl]="nombreControl" />
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Filtrar por categoría</mat-label>
        <input matInput [formControl]="categoriaControl" />
      </mat-form-field>
      <button mat-raised-button color="primary" (click)="openAgregarLugar()">
        <mat-icon>add_location_alt</mat-icon> Agregar Lugar Turístico
      </button>
    </div>
    <div *ngIf="isLoading" style="text-align: center; padding: 40px;">
      <mat-spinner diameter="40"></mat-spinner>
      <p style="margin-top: 16px; color: #666;">Cargando lugares turísticos...</p>
    </div>
    
    <table mat-table [dataSource]="filteredLugares" class="mat-elevation-z8" *ngIf="!isLoading && lugares.length">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Nombre</th>
        <td mat-cell *matCellDef="let lugar">{{ lugar.name }}</td>
      </ng-container>
      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Descripción</th>
        <td mat-cell *matCellDef="let lugar">{{ lugar.description }}</td>
      </ng-container>
      <ng-container matColumnDef="location">
        <th mat-header-cell *matHeaderCellDef>Ubicación</th>
        <td mat-cell *matCellDef="let lugar">{{ lugar.location }}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Categoría</th>
        <td mat-cell *matCellDef="let lugar">{{ lugar.category || 'Sin categoría' }}</td>
      </ng-container>
      <ng-container matColumnDef="active">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let lugar">
          <span [ngClass]="lugar.active ? 'estado-activo' : 'estado-inactivo'">
            {{ lugar.active ? 'Activo' : 'Inactivo' }}
          </span>
        </td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let lugar">
          <button mat-icon-button color="primary" (click)="openEditarLugar(lugar)" matTooltip="Editar lugar">
            <mat-icon>edit</mat-icon>
          </button>
          <button mat-icon-button [color]="lugar.active ? 'warn' : 'primary'" (click)="toggleActivo(lugar)" 
                  [matTooltip]="lugar.active ? 'Desactivar lugar' : 'Activar lugar'">
            <mat-icon>{{ lugar.active ? 'block' : 'check_circle' }}</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    
    <div *ngIf="!isLoading && !lugares.length" style="text-align: center; padding: 40px; color: #666;">
      <mat-icon style="font-size: 48px; color: #ccc; margin-bottom: 16px;">location_off</mat-icon>
      <h3>No hay lugares registrados</h3>
      <p>Comienza agregando el primer lugar turístico de Esmeraldas.</p>
    </div>
  `,
  styles: [`
    .estado-activo { color: #388e3c; font-weight: 600; }
    .estado-inactivo { color: #b71c1c; font-weight: 600; }
    table { width: 100%; margin-top: 18px; }
    th.mat-header-cell, td.mat-cell { text-align: left; padding: 12px 16px; }
    button[mat-icon-button] { margin-right: 4px; }
  `]
})
export class PlaceComponent implements OnInit {
  lugares: any[] = [];
  filteredLugares: any[] = [];
  nombreControl = new FormControl('');
  categoriaControl = new FormControl('');
  displayedColumns = ['name', 'description', 'location', 'category', 'active', 'acciones'];
  isLoading = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit() {
    this.cargarLugares();
    this.nombreControl.valueChanges.subscribe(() => this.filtrarLugares());
    this.categoriaControl.valueChanges.subscribe(() => this.filtrarLugares());
  }

  cargarLugares() {
    this.isLoading = true;
    this.http.get<any>(getApiUrl('/places')).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.lugares = res.data || [];
        } else {
          this.lugares = [];
        }
        this.filtrarLugares();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al cargar lugares:', err);
        this.snackBar.open('Error al cargar lugares: ' + (err.error?.message || err.message), 'Cerrar', { duration: 3000 });
        this.lugares = [];
        this.filtrarLugares();
      }
    });
  }

  filtrarLugares() {
    const nombre = (this.nombreControl.value || '').toLowerCase();
    const categoria = (this.categoriaControl.value || '').toLowerCase();
    this.filteredLugares = this.lugares.filter(l =>
      l.name.toLowerCase().includes(nombre) &&
      (!categoria || (l.category || '').toLowerCase().includes(categoria))
    );
  }

  openAgregarLugar() {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos a enviar:', result);
        this.http.post(getApiUrl('/places'), result).subscribe({
          next: (res: any) => {
            console.log('Respuesta exitosa:', res);
            if (res.success) {
              this.snackBar.open('Lugar creado correctamente', 'Cerrar', { duration: 2000 });
              this.cargarLugares();
            } else {
              this.snackBar.open('Error al crear lugar: ' + (res.message || 'Error desconocido'), 'Cerrar', { duration: 3000 });
            }
          },
          error: err => {
            console.error('Error al crear lugar:', err);
            console.error('Datos enviados:', result);
            console.error('Respuesta del servidor:', err.error);
            
            let errorMessage = 'Error al crear lugar';
            if (err.status === 401) {
              errorMessage = 'No tienes permisos para crear lugares. Debes ser usuario GAD.';
            } else if (err.status === 400) {
              if (err.error?.errors && Array.isArray(err.error.errors)) {
                const validationErrors = err.error.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
                errorMessage = 'Errores de validación: ' + validationErrors;
              } else {
                errorMessage = 'Datos inválidos: ' + (err.error?.message || 'Verifica los campos requeridos');
              }
            } else if (err.error?.message) {
              errorMessage = err.error.message;
            }
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
          }
        });
      }
    });
  }

  openEditarLugar(lugar: any) {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      data: lugar,
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(getApiUrl(`/places/${lugar._id}`), result).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.snackBar.open('Lugar actualizado correctamente', 'Cerrar', { duration: 2000 });
              this.cargarLugares();
            } else {
              this.snackBar.open('Error al actualizar lugar: ' + (res.message || 'Error desconocido'), 'Cerrar', { duration: 3000 });
            }
          },
          error: err => {
            console.error('Error al actualizar lugar:', err);
            let errorMessage = 'Error al actualizar lugar';
            if (err.status === 401) {
              errorMessage = 'No tienes permisos para editar lugares. Debes ser usuario GAD.';
            } else if (err.status === 400) {
              errorMessage = 'Datos inválidos: ' + (err.error?.message || 'Verifica los campos requeridos');
            } else if (err.status === 404) {
              errorMessage = 'Lugar no encontrado';
            } else if (err.error?.message) {
              errorMessage = err.error.message;
            }
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 4000 });
          }
        });
      }
    });
  }

  toggleActivo(lugar: any) {
    const newActiveState = !lugar.active;
    console.log('Cambiando estado de lugar:', lugar._id, 'de', lugar.active, 'a', newActiveState);
    
    this.http.patch(getApiUrl(`/places/${lugar._id}/status`), { active: newActiveState }).subscribe({
      next: (res: any) => {
        console.log('Respuesta exitosa al actualizar estado:', res);
        if (res.success) {
          this.snackBar.open('Estado actualizado correctamente', 'Cerrar', { duration: 2000 });
          this.cargarLugares();
        } else {
          this.snackBar.open('Error al actualizar estado: ' + (res.message || 'Error desconocido'), 'Cerrar', { duration: 3000 });
        }
      },
      error: err => {
        console.error('Error al actualizar estado:', err);
        console.error('Datos enviados:', { active: newActiveState });
        console.error('Respuesta del servidor:', err.error);
        
        let errorMessage = 'Error al actualizar estado';
        if (err.status === 401) {
          errorMessage = 'No tienes permisos para modificar lugares. Debes ser usuario GAD.';
        } else if (err.status === 400) {
          if (err.error?.errors && Array.isArray(err.error.errors)) {
            const validationErrors = err.error.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
            errorMessage = 'Errores de validación: ' + validationErrors;
          } else {
            errorMessage = 'Datos inválidos: ' + (err.error?.message || 'Verifica los campos requeridos');
          }
        } else if (err.status === 404) {
          errorMessage = 'Lugar no encontrado';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }
        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
} 