import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ],
  template: `
    <h1>Reseñas</h1>
    <div style="display: flex; gap: 18px; margin-bottom: 16px; align-items: flex-end;">
      <mat-form-field appearance="outline">
        <mat-label>Filtrar por lugar</mat-label>
        <mat-select [formControl]="lugarControl">
          <mat-option value="">Todos</mat-option>
          <mat-option *ngFor="let lugar of lugares" [value]="lugar._id">{{ lugar.name }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Estado</mat-label>
        <mat-select [formControl]="estadoControl">
          <mat-option value="">Todos</mat-option>
          <mat-option value="aprobada">Aprobadas</mat-option>
          <mat-option value="rechazada">Rechazadas</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
    <table mat-table [dataSource]="filteredResenas" class="mat-elevation-z8" *ngIf="resenas.length">
      <ng-container matColumnDef="lugar">
        <th mat-header-cell *matHeaderCellDef>Lugar</th>
        <td mat-cell *matCellDef="let resena">{{ resena.lugar?.name }}</td>
      </ng-container>
      <ng-container matColumnDef="usuario">
        <th mat-header-cell *matHeaderCellDef>Usuario</th>
        <td mat-cell *matCellDef="let resena">{{ resena.usuario?.nombre }}</td>
      </ng-container>
      <ng-container matColumnDef="comentario">
        <th mat-header-cell *matHeaderCellDef>Comentario</th>
        <td mat-cell *matCellDef="let resena">{{ resena.comentario }}</td>
      </ng-container>
      <ng-container matColumnDef="calificacion">
        <th mat-header-cell *matHeaderCellDef>Calificación</th>
        <td mat-cell *matCellDef="let resena">{{ resena.calificacion }}</td>
      </ng-container>
      <ng-container matColumnDef="estado">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let resena">{{ resena.estado }}</td>
      </ng-container>
      <ng-container matColumnDef="acciones">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let resena">
          <button mat-icon-button color="primary" *ngIf="resena.estado !== 'aprobada'" (click)="cambiarEstado(resena, 'aprobada')">
            <mat-icon>check_circle</mat-icon>
          </button>
          <button mat-icon-button color="warn" *ngIf="resena.estado !== 'rechazada'" (click)="cambiarEstado(resena, 'rechazada')">
            <mat-icon>block</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <div *ngIf="!resenas.length">No hay reseñas registradas.</div>
  `
})
export class ReviewComponent implements OnInit {
  resenas: any[] = [];
  lugares: any[] = [];
  filteredResenas: any[] = [];
  lugarControl = new FormControl('');
  estadoControl = new FormControl('');
  displayedColumns = ['lugar', 'usuario', 'comentario', 'calificacion', 'estado', 'acciones'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.cargarLugares();
    this.cargarResenas();
    this.lugarControl.valueChanges.subscribe(() => this.cargarResenas());
    this.estadoControl.valueChanges.subscribe(() => this.cargarResenas());
  }

  cargarLugares() {
    this.http.get<any>('http://localhost:3001/places').subscribe(res => {
      this.lugares = res.data?.places || res.places || [];
    });
  }

  cargarResenas() {
    const params: any = {};
    if (this.lugarControl.value) params.lugarId = this.lugarControl.value;
    if (this.estadoControl.value) params.estado = this.estadoControl.value === 'rechazada' ? 'rechazada' : 'aprobada';
    this.http.get<any>('http://localhost:3001/reviews/admin', { params }).subscribe(res => {
      this.resenas = (res.data || []).map((r: any) => ({
        ...r,
        lugar: r.lugarId,
        usuario: r.usuarioId
      }));
      this.filteredResenas = this.resenas;
    });
  }

  cambiarEstado(resena: any, estado: string) {
    const estadoBackend = estado === 'rechazada' ? 'rechazada' : estado;
    this.http.put(`http://localhost:3001/reviews/admin/${resena._id}`, { estado: estadoBackend }).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
        this.cargarResenas();
      },
      error: err => {
        this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 2000 });
      }
    });
  }
} 