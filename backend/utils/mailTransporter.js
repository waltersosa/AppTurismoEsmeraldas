import nodemailer from "nodemailer";
import { NOTIFICATION_CONFIG } from "../config/notification.config.js";
  /**
   * Configurar transportador de email
   */
export function createEmailTransporter() {
    try {
      return nodemailer.createTransport({
        host: NOTIFICATION_CONFIG.email.smtp.host,
        port: NOTIFICATION_CONFIG.email.smtp.port,
        secure: NOTIFICATION_CONFIG.email.smtp.secure,
        auth: {
          user: NOTIFICATION_CONFIG.email.smtp.user,
          pass: NOTIFICATION_CONFIG.email.smtp.password,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
    } catch (error) {
      console.error("Error configurando transportador de email:", error);
      throw new Error("Error en configuración de email");
    }
  }