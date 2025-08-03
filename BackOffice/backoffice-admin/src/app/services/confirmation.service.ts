import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private dialog = inject(MatDialog);

  /**
   * Muestra un diálogo de confirmación personalizado
   */
  confirm(data: ConfirmationData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirmar',
        cancelText: data.cancelText || 'Cancelar',
        type: data.type || 'warning'
      },
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

  /**
   * Confirmación para deshabilitar usuario
   */
  confirmDisableUser(userName: string): Observable<boolean> {
    return this.confirm({
      title: 'Deshabilitar Usuario',
      message: `¿Estás seguro de que deseas deshabilitar al usuario "${userName}"? El usuario no podrá acceder al sistema hasta que sea habilitado nuevamente.`,
      confirmText: 'Deshabilitar',
      cancelText: 'Cancelar',
      type: 'warning'
    });
  }

  /**
   * Confirmación para habilitar usuario
   */
  confirmEnableUser(userName: string): Observable<boolean> {
    return this.confirm({
      title: 'Habilitar Usuario',
      message: `¿Estás seguro de que deseas habilitar al usuario "${userName}"? El usuario podrá acceder al sistema nuevamente.`,
      confirmText: 'Habilitar',
      cancelText: 'Cancelar',
      type: 'info'
    });
  }

  /**
   * Confirmación para eliminar usuario permanentemente
   */
  confirmDeleteUser(userName: string): Observable<boolean> {
    return this.confirm({
      title: 'Eliminar Usuario Permanentemente',
      message: `¿Estás seguro de que deseas eliminar permanentemente al usuario "${userName}"? Esta acción no se puede deshacer y todos los datos asociados al usuario serán eliminados.`,
      confirmText: 'Eliminar Permanentemente',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  /**
   * Confirmación para activar lugar
   */
  confirmActivatePlace(placeName: string): Observable<boolean> {
    return this.confirm({
      title: 'Activar Lugar',
      message: `¿Estás seguro de que quieres activar "${placeName}"? El lugar será visible para los usuarios.`,
      confirmText: 'Activar',
      cancelText: 'Cancelar',
      type: 'info'
    });
  }

  /**
   * Confirmación para desactivar lugar
   */
  confirmDeactivatePlace(placeName: string): Observable<boolean> {
    return this.confirm({
      title: 'Desactivar Lugar',
      message: `¿Estás seguro de que quieres desactivar "${placeName}"? El lugar no será visible para los usuarios.`,
      confirmText: 'Desactivar',
      cancelText: 'Cancelar',
      type: 'warning'
    });
  }

  /**
   * Confirmación para eliminar lugar permanentemente
   */
  confirmDeletePlace(placeName: string): Observable<boolean> {
    return this.confirm({
      title: 'Eliminar Lugar Permanentemente',
      message: `¿Estás seguro de que quieres eliminar permanentemente "${placeName}"? Esta acción no se puede deshacer y todos los datos asociados al lugar serán eliminados.`,
      confirmText: 'Eliminar Permanentemente',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }
} 