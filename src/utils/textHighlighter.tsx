import React from "react";

// Danh sách từ khóa cảnh báo nguy cơ (tô màu đỏ / hồng để người già & trẻ em nhìn thấy ngay)
const RED_FLAG_KEYWORDS = [
  "rửa tiền",
  "45 tỷ",
  "300 triệu",
  "bắt tạm giam",
  "bị áp giải",
  "áp giải",
  "chuyển tiền",
  "chuyển ngay",
  "tài khoản tạm giữ",
  "tài khoản thanh tra",
  "tài khoản ma",
  "mã OTP",
  "mật khẩu",
  "đe dọa",
  "khởi tố",
  "bí mật",
  "tiết lộ",
  "tải app",
  "file .apk",
  ".apk",
  "cọc tiền",
  "nạp tiền",
  "trúng thưởng",
  "quà 0 đồng",
  "khẩn cấp",
  "chuyển khoản",
  "30 phút",
  "bị khóa",
  "link lạ",
  "zalo",
  "đóng băng",
  "phạt tù",
  "mất trắng",
];

// Danh sách từ khóa hành động an toàn (tô màu xanh ngọc / xanh lá để dễ nhớ)
const SAFE_KEYWORDS = [
  "Dừng lại",
  "Cúp máy",
  "Dập máy",
  "Kiểm tra",
  "Xác minh",
  "Mới hành động",
  "113",
  "156",
  "Công an Phường",
  "người thân",
  "con cháu",
  "trực tiếp",
  "không chuyển tiền",
  "không chuyển",
  "tuyệt đối không",
  "không đọc mã OTP",
  "tổng đài chính thức",
  "báo cơ quan",
  "bình tĩnh",
  "trình báo",
];

/**
 * Hàm tự động làm nổi bật các từ khóa trọng tâm bằng màu sắc tương phản cao
 * Giúp người cao tuổi và trẻ em quét mắt là thấy ngay bản chất của thông tin
 */
export function HighlightKeywords({ text }: { text: string }): React.ReactElement {
  if (!text) return <></>;

  // Tạo regex match các từ khóa (case insensitive)
  const allKeywords = [...RED_FLAG_KEYWORDS, ...SAFE_KEYWORDS].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${allKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        const lower = part.toLowerCase();
        const isMatch = allKeywords.some((k) => k.toLowerCase() === lower);
        if (isMatch) {
          return (
            <strong key={i} className="font-bold text-slate-900">
              {part}
            </strong>
          );
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
}
