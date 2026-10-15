"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Lock,
} from "lucide-react";

export function DemoQuizSection() {
  const { openAuthModal } = useAuth();
  const [activeDemoIdx, setActiveDemoIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const demoScenarios = [
    {
      id: "demo-1",
      badge: "Câu hỏi Demo 1 / 2",
      type: "Cuộc gọi mạo danh",
      title: "Cuộc gọi tự xưng 'Cán bộ điều tra Bộ Công an'",
      stimulus: {
        caller: "089.882.19xx (Mạo danh Công an)",
        content:
          "Chào anh/chị, tôi là Trung úy Nguyễn Tuấn Anh thuộc Cục CSĐT Tội phạm kinh tế. Số CMND của anh/chị đang dính líu vào đường dây rửa tiền xuyên quốc gia trị giá 12 tỷ đồng. Yêu cầu anh/chị hợp tác điều tra, chuyển toàn bộ 50 triệu tiền tiết kiệm vào tài khoản giám định của cơ quan chúng tôi trong vòng 30 phút để phục vụ thanh tra, nếu không sẽ bị bắt tạm giam ngay trong ngày!",
      },
      question: "Bạn đang nhận được cuộc gọi gây sức ép trên. Hành vi an toàn đúng đắn nhất là gì?",
      options: [
        {
          text: "Chuyển ngay 50 triệu vì sợ bị bắt giam và để chứng minh mình trong sạch.",
          isCorrect: false,
          explanation: "Sai lầm nguy hiểm: Nếu chuyển tiền, kẻ gian sẽ tẩu tán ngay lập tức qua nhiều tầng tài khoản ảo và bạn sẽ mất trắng toàn bộ tài sản.",
        },
        {
          text: "Giữ bình tĩnh, dứt khoát không chuyển tiền; cơ quan Công an Việt Nam KHÔNG BAO GIỜ làm việc hay yêu cầu chuyển tiền qua điện thoại.",
          isCorrect: true,
          explanation: "Chính xác! Công an, Viện kiểm sát và Tòa án tại Việt Nam chỉ làm việc trực tiếp tại trụ sở qua giấy triệu tập bằng văn bản. Mọi yêu cầu chuyển tiền qua điện thoại đều là lừa đảo 100%.",
        },
        {
          text: "Xin kết bạn Zalo với cán bộ để gửi ảnh căn cước công dân và thương lượng giảm tiền đặt cọc.",
          isCorrect: false,
          explanation: "Không an toàn: Gửi ảnh CCCD sẽ khiến bạn bị lộ thông tin cá nhân và bị kẻ gian dùng để đăng ký vay nợ tín chấp trực tuyến.",
        },
        {
          text: "Cung cấp mã OTP ngân hàng để người gọi tự truy cập kiểm tra tài khoản giúp mình.",
          isCorrect: false,
          explanation: "Cực kỳ nguy hiểm: Mã OTP là chìa khóa rút tiền. Cung cấp OTP đồng nghĩa với việc bạn tự mở cửa cho kẻ gian rút sạch tiền.",
        },
      ],
    },
    {
      id: "demo-2",
      badge: "Câu hỏi Demo 2 / 2",
      type: "Tin nhắn giả mạo (Phishing)",
      stimulus: {
        caller: "SMS Brandname: NGAN_HANG_ABC",
        content:
          "Canh bao: Tai khoan quy khach se bi TAM KHOA sau 24h do chua cap nhat sinh trac hoc theo Quyet dinh 2345/QD-NHNN. Vui long truy cap ngay vao https://vietcom-capnhat-sinhtrachoc.top de xac thuc tranh gian doan giao dich.",
      },
      question: "Quan sát tin nhắn trên, dấu hiệu lừa đảo rõ ràng nhất là gì?",
      options: [
        {
          text: "Đường link có tên miền đuôi lạ '.top' (không phải website chính thức có đuôi .com.vn hoặc .vn của ngân hàng tại Việt Nam).",
          isCorrect: true,
          explanation: "Chính xác! Kẻ lừa đảo sử dụng tên miền quốc tế giá rẻ (.top, .xyz, .cc, .vip) để dựng website giả mạo. Các ngân hàng lớn tại Việt Nam chỉ sử dụng tên miền chính thống như vietcombank.com.vn hoặc mbbank.com.vn.",
        },
        {
          text: "Tin nhắn không có dấu tiếng Việt.",
          isCorrect: false,
          explanation: "Nhiều tin nhắn SMS viễn thông thông thường cũng không dấu để tiết kiệm ký tự, đây không phải dấu hiệu quyết định.",
        },
        {
          text: "Tin nhắn gửi vào buổi tối.",
          isCorrect: false,
          explanation: "Hệ thống tin nhắn tự động của ngân hàng có thể gửi 24/7, thời gian gửi không phải căn cứ nhận diện.",
        },
        {
          text: "Có nhắc đến Quyết định 2345/QĐ-NHNN.",
          isCorrect: false,
          explanation: "Kẻ gian thường lấy số hiệu văn bản pháp luật có thật để tạo vẻ uy tín giả mạo, ru ngủ người đọc.",
        },
      ],
    },
  ];

  const currentScenario = demoScenarios[activeDemoIdx];

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      setSubmitted(true);
    }
  };

  const handleSwitchQuestion = (idx: number) => {
    setActiveDemoIdx(idx);
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <section id="demo-quiz" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Trải Nghiệm Thực Tế Ngay (Không Cần Đăng Nhập)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            2 Câu Hỏi Thử Thách Demo Trực Tuyến
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Thử tài nhận diện bẫy thao túng tâm lý và dấu hiệu lừa đảo phổ biến trước khi đăng nhập vào trọn bộ 39 ải
          </p>

          {/* Toggle between 2 demo questions */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 gap-1.5 pt-2">
            {demoScenarios.map((demo, idx) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleSwitchQuestion(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDemoIdx === idx
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200 font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {demo.badge}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Stage: Left Scenario + Right Interaction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start rounded-3xl bg-slate-50 border-2 border-slate-200 p-5 sm:p-8 shadow-sm">
          {/* Left: Device Simulator Mockup */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Tình huống giả định</span>
            </div>

            <div className="rounded-2xl bg-white border-2 border-slate-300 shadow-sm overflow-hidden">
              {/* Phone Header */}
              <div className="bg-slate-100 px-4 py-2 text-[11px] font-mono text-slate-600 border-b border-slate-200 flex items-center justify-between">
                <span>09:41</span>
                <span>{currentScenario.type}</span>
              </div>

              {/* Message Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                  {activeDemoIdx === 0 ? (
                    <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span className="line-clamp-1">{currentScenario.stimulus.caller}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {currentScenario.stimulus.content}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Question & Options */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 inline-block">
                {currentScenario.title}
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                {currentScenario.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentScenario.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const letter = String.fromCharCode(65 + oIdx);

                let optStyle = "border-slate-200 bg-white hover:border-slate-300 text-slate-800";
                if (isSelected && !submitted) {
                  optStyle = "border-blue-600 bg-blue-50/80 text-blue-950 font-bold ring-2 ring-blue-200";
                } else if (submitted) {
                  if (opt.isCorrect) {
                    optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                  } else if (isSelected && !opt.isCorrect) {
                    optStyle = "border-rose-400 bg-rose-50 text-rose-950 line-through opacity-75";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelect(oIdx)}
                    className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit or Explanation */}
            {!submitted ? (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Xác Nhận Đáp Án</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  {currentScenario.options[selectedOption!].isCorrect ? (
                    <span className="text-emerald-700 flex items-center gap-1 font-black">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Phản xạ chính xác!
                    </span>
                  ) : (
                    <span className="text-rose-700 flex items-center gap-1 font-black">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Cần lưu ý điểm này!
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {currentScenario.options[selectedOption!].explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to action for full 39 levels & chatbot */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              Muốn chinh phục trọn bộ 39 ải và đồng hành cùng CyberGuardBot?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Đăng nhập miễn phí bằng SĐT hoặc Email để rèn luyện kịch bản phân nhánh (Branching), khoanh vùng đáng ngờ (Hotspot) và lưu thang đo năng lực.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAuthModal("signup")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md hover-lift flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <span>Tạo Tài Khoản Rèn Luyện Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
