 use axum::{routing::get, Json, Router};
 use serde::Serialize;
 use std::net::SocketAddr;
 use tower_http::cors::{Any, CorsLayer};
 
 #[derive(Serialize)]
 struct HealthResponse {
     status: &'static str,
     message: &'static str,
 }
 
 async fn health() -> Json<HealthResponse> {
     Json(HealthResponse {
         status: "ok",
         message: "Rust backend is running",
     })
 }
 
 #[tokio::main]
 async fn main() {
     let cors = CorsLayer::new().allow_origin(Any);
 
     let app = Router::new()
         .route("/api/health", get(health))
         .layer(cors);
 
     let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
     println!("Rust backend listening on http://{addr}");
 
     axum::serve(
         tokio::net::TcpListener::bind(addr).await.unwrap(),
         app,
     )
     .await
     .unwrap();
 }
