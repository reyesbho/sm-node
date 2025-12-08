/**
 * Script para inicializar datos base en Firestore (Firebase)
 * Ejecutar con: node seed.js
 */

import admin from "firebase-admin";
import { readFileSync } from "fs";
import { config } from "dotenv";

// Cargar credenciales del servicio
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
config({ path: envFile });

const firebaseAdminConfig = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminConfig),
});

const db = admin.firestore();

async function seedFirestore() {
  const batch = db.batch();

  console.log("🚀 Iniciando carga de datos...");

  // =========================
  // 1️⃣ Colección: companias
  // =========================
  const companiaRef = db.collection("companias").doc("compania_001");

  batch.set(companiaRef, {
    razon_social: "Pastelería Dulce Sabor",
    descripcion: "Pasteles personalizados y repostería artesanal",
    logo: "https://example.com/logo.png",
    propietario_id: "usuario_001",
    creada_en: admin.firestore.FieldValue.serverTimestamp(),
    actualizada_en: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Subcolecciones dentro de compania_001
  const productos = [
    {
      id: "producto_001",
      descripcion: "Pastel de chocolate",
      imagen: "https://example.com/pastel_chocolate.jpg",
      estatus: true,
      tag: "chocolate",
      es_global: false,
    },
    {
      id: "producto_002",
      descripcion: "Pastel de fresa",
      imagen: "https://example.com/pastel_fresa.jpg",
      estatus: true,
      tag: "fresa",
      es_global: false,
    },
  ];

  productos.forEach((p) =>
    batch.set(companiaRef.collection("productos").doc(p.id), p)
  );

  const sabores = [
    { id: "sabor_001", descripcion: "Vainilla", estatus: true, es_global: false },
    { id: "sabor_002", descripcion: "Chocolate", estatus: true, es_global: false },
  ];

  sabores.forEach((s) =>
    batch.set(companiaRef.collection("sabores").doc(s.id), s)
  );

  const clientes = [
    {
      id: "cliente_001",
      nombre: "Ana",
      apellido_paterno: "López",
      apellido_materno: "Martínez",
      social_network: "@ana.lopez",
      direccion: "Av. Reforma #100, CDMX",
      fecha_nacimiento: new Date("1995-03-10T00:00:00Z"),
    },
  ];

  clientes.forEach((c) =>
    batch.set(companiaRef.collection("clientes").doc(c.id), c)
  );

  // Pedido con productos, pagos, historial
  const pedidoRef = companiaRef.collection("pedidos").doc("pedido_001");
  batch.set(pedidoRef, {
    cliente_id: "cliente_001",
    cliente_nombre: "Ana López Martínez",
    estatus_actual: { id: "pendiente", descripcion: "Pendiente" },
    estatus_pago: { id: "pagado", descripcion: "Pagado" },
    total: 350.0,
    fecha_creacion: admin.firestore.FieldValue.serverTimestamp(),
    fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp(),
    fecha_entrega: admin.firestore.Timestamp.fromDate(
      new Date("2025-11-11T16:00:00Z")
    ),
    lugar_entrega: "Sucursal Centro",
    registrado_por: "usuario_002",
  });

  batch.set(pedidoRef.collection("productos").doc("pp_001"), {
    producto_id: "producto_001",
    descripcion: "Pastel de chocolate",
    size: "Mediano",
    cantidad: 1,
    precio_unitario: 350.0,
    sub_total: 350.0,
    sabor: "Chocolate",
    relleno: "Fresa",
    cobertura: "Chocolate",
    personalizacion_texto: "Feliz cumpleaños Ana",
    imagen_referencia: "https://example.com/pedido1_referencia.jpg",
  });

  batch.set(pedidoRef.collection("pagos").doc("pago_001"), {
    metodo: "Tarjeta",
    monto: 350.0,
    referencia: "TX12345",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(pedidoRef.collection("historial_estatus").doc("hist_001"), {
    estatus: "Pendiente",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
    comentario: "Pedido recibido",
  });

  batch.set(pedidoRef.collection("historial_estatus").doc("hist_002"), {
    estatus: "Pagado",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
    comentario: "Pago confirmado",
  });

  // =========================
  // 2️⃣ Colección: usuarios
  // =========================
  const usuarios = [
    {
      id: "usuario_001",
      rol: { id: "rol_admin", clave: "ADMIN", descripcion: "Administrador general" },
      username: "juanperez",
      email: "juan@example.com",
      password_hash: "hashed_password_123",
      fecha_registro: admin.firestore.FieldValue.serverTimestamp(),
      fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      id: "usuario_002",
      rol: { id: "rol_vendedor", clave: "USER", descripcion: "Vendedor" },
      username: "maria",
      email: "maria@example.com",
      password_hash: "hashed_password_456",
      fecha_registro: admin.firestore.FieldValue.serverTimestamp(),
      fecha_actualizacion: admin.firestore.FieldValue.serverTimestamp(),
    },
  ];

  usuarios.forEach((u) => batch.set(db.collection("usuarios").doc(u.id), u));

  // =========================
  // 3️⃣ Colección: catalogos
  // =========================
  const catalogosRef = db.collection("catalogos").doc("valores");
  batch.set(catalogosRef, {
    estatus_pedido: {
      pendiente: { descripcion: "Pendiente" },
      pagado: { descripcion: "Pagado" },
      enviado: { descripcion: "Enviado" },
      entregado: { descripcion: "Entregado" },
    },
    estatus_pago: {
      pendiente: { descripcion: "Pendiente" },
      pagado: { descripcion: "Pagado" },
      rechazado: { descripcion: "Rechazado" },
    },
    roles: {
      rol_admin: { clave: "ADMIN", descripcion: "Administrador general" },
      rol_vendedor: { clave: "USER", descripcion: "Vendedor de punto de venta" },
    },
  });

  // =========================
  // 💾 Ejecutar batch
  // =========================
  await batch.commit();

  console.log("✅ Carga inicial completada exitosamente.");
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error("❌ Error al cargar datos:", err);
  process.exit(1);
});
