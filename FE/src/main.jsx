import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./containers/App/App";
import "regenerator-runtime/runtime";

// Ngân hàng	NCB
// Số thẻ	9704198526191432198
// Tên chủ thẻ	NGUYEN VAN A
// Ngày phát hành	07/15
// Mật khẩu OTP	123456

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    // </StrictMode>
    <App />
);
