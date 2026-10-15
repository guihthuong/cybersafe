import { Scenario } from "@/types/scenario";

// ============================================================================
// DỮ LIỆU CHUẨN XÁC THEO YÊU CẦU PHASE 2 CỦA NGÂN HÀNG CÂU HỎI
// ============================================================================

// 1. Q1.1 - BRANCHING SCENARIO
// Giả danh công an gọi điện dọa rửa tiền, ép ông Bình (68 tuổi) chuyển 300 triệu vào "tài khoản tạm giữ"
export const SCENARIO_Q1_1: Scenario = {
  scenario_id: "Q1.1",
  category: "fake_police_authority",
  category_name_vi: "Giả mạo cơ quan công an / Viện kiểm sát",
  skill: "Nhận diện thủ đoạn đe dọa tố tụng qua điện thoại & Quy tắc bất di bất dịch của cơ quan hành pháp",
  difficulty: "intermediate",
  question_type: "branching_scenario",
  context: "10h sáng ngày thứ Ba, ông Bình (68 tuổi, cán bộ hưu trí) đang ở nhà một mình thì nhận được cuộc gọi từ số lạ (024.3984.xxxx). Người gọi xưng là Trung tá Vũ thuộc Cơ quan Cảnh sát điều tra Bộ Công an, thông báo ông Bình liên quan đến đường dây ma túy - rửa tiền xuyên quốc gia và yêu cầu chuyển 300 triệu tiết kiệm vào 'tài khoản tạm giữ điều tra'.",
  stimulus: {
    type: "phone_call",
    sender: "Trung tá Vũ - C03 Bộ Công an",
    timestamp: "10:05 AM",
    content: "'Bác Bình nghe rõ không? Số căn cước 001056xxxxxx của bác đã bị các đối tượng dùng để mở tài khoản rửa 45 tỷ đồng. Lệnh bắt tạm giam đã được Viện Kiểm sát ký. Bác muốn bị áp giải hay muốn phối hợp chứng minh trong sạch ngay bây giờ?'",
    metadata: {
      "Số gọi đến": "024.3984.xxxx (Số bàn bàn đầu số Hà Nội)",
      "Đối tượng nhắm đến": "Người cao tuổi ở nhà một mình",
      "Thủ thuật tâm lý": "Gây sốc, tạo hoang mang, đe dọa tù tội"
    }
  },
  options: {
    start_node_id: "node_start",
    branching_tree: {
      node_start: {
        id: "node_start",
        prompt: "Giọng nói đanh thép quát qua điện thoại: 'Chúng tôi đang ghi âm cuộc gọi bảo mật cấp 1! Nếu bác để lộ thông tin cho bất kỳ ai kể cả vợ con, bác sẽ bị truy tố thêm tội Tiết lộ bí mật điều tra! Bây giờ bác trả lời: Bác có đang dính líu đến đường dây này không?'",
        choices: [
          {
            id: "choice_panic",
            text: "Hoang mang thanh minh: 'Tôi cả đời làm giáo viên hưu trí, không bao giờ làm điều phi pháp! Xin cán bộ điều tra minh oan cho tôi!'",
            next_node_id: "node_pressure_zalo",
            is_safe: false,
            feedback: "Kẻ gian nhận biết bạn đang hoảng loạn và bắt đầu nắm quyền kiểm soát tâm lý hoàn toàn."
          },
          {
            id: "choice_ask_notice",
            text: "Nghi ngờ hỏi: 'Cơ quan công an muốn làm việc thì phải có giấy mời hoặc giấy triệu tập của công an phường gửi đến nhà chứ?'",
            next_node_id: "node_fake_doc_threat",
            is_safe: true,
            feedback: "Cảnh giác rất tốt! Đây là phản xạ đúng của công dân hiểu biết pháp luật."
          },
          {
            id: "choice_hang_up_immediately",
            text: "Dừng lại: Nói thẳng 'Tôi sẽ ra Công an Phường sở tại để phối hợp trực tiếp' và dứt khoát cúp máy.",
            next_node_id: "node_safe_resolved",
            is_safe: true,
            feedback: "Quyết định xử lý an toàn tuyệt đối! Cắt đứt hoàn toàn luồng thao túng tâm lý của tội phạm."
          }
        ]
      },

      node_pressure_zalo: {
        id: "node_pressure_zalo",
        prompt: "Đối tượng chuyển giọng 'thông cảm': 'Tôi tin bác bị kẻ xấu lợi dụng. Nhưng theo quy trình tố tụng, bác phải kết bạn ngay Zalo nội bộ 'Đồng chí Vũ - Trọng án' để tôi gửi Lệnh Bắt Tạm Giam cho bác đọc và xác nhận lời khai!'",
        choices: [
          {
            id: "choice_accept_zalo",
            text: "Vội vàng mở Zalo kết bạn và tải hình ảnh 'Lệnh bắt tạm giam' có dấu đỏ về xem.",
            next_node_id: "node_demand_money",
            is_safe: false,
            feedback: "Rơi vào bẫy thị giác! Các văn bản tố tụng có dấu đỏ trên mạng xã hội 100% là sản phẩm photoshop giả mạo."
          },
          {
            id: "choice_pause_call_family",
            text: "Dừng lại: Giữ bình tĩnh, nói 'Để tôi gọi cho con trai tôi làm luật sư' rồi ngắt cuộc gọi.",
            next_node_id: "node_safe_resolved",
            is_safe: true,
            feedback: "Phá vỡ bẫy cô lập! Kẻ lừa đảo sợ nhất việc nạn nhân kết nối với người thân có hiểu biết."
          }
        ]
      },

      node_fake_doc_threat: {
        id: "node_fake_doc_threat",
        prompt: "Kẻ mạo danh quát lớn: 'Vụ án đặc biệt khẩn cấp nên áp dụng lệnh bắt truy xét hỏa tốc! Tôi gửi bản scan Lệnh bắt tạm giam qua số Zalo của bác rồi đấy. Trong 30 phút nữa nếu bác không chứng minh dòng tiền, cảnh sát cơ động sẽ đến còng tay bác!'",
        choices: [
          {
            id: "choice_check_zalo_fear",
            text: "Thấy có dấu đỏ của Viện Kiểm sát gửi qua Zalo thì hoảng sợ, xin làm theo hướng dẫn chứng minh dòng tiền.",
            next_node_id: "node_demand_money",
            is_safe: false,
            feedback: "Nỗi sợ làm lu mờ lý trí: Cơ quan nhà nước không bao giờ tống đạt lệnh tố tụng qua Zalo."
          },
          {
            id: "choice_go_to_local_police",
            text: "Kiểm tra: Không xem Zalo, mặc áo khoác đi thẳng ra trụ sở Công an Phường gần nhất để hỏi trực tiếp.",
            next_node_id: "node_safe_resolved",
            is_safe: true,
            feedback: "Hành động chuẩn mực tuyệt đối! Cán bộ Công an Phường sẽ xác nhận ngay đây là trò lừa đảo."
          }
        ]
      },

      node_demand_money: {
        id: "node_demand_money",
        prompt: "Đối tượng ra đòn quyết định: 'Để phục vụ giám định tài chính sạch - bẩn, bác phải ra ngân hàng rút ngay 300 triệu trong sổ tiết kiệm chuyển vào 'Tài khoản giám định tạm giữ' số: 104882xxxx (VietinBank) mang tên 'Ban Quản Lý Án'. Sau 2 giờ thanh tra nếu tiền sạch, Nhà nước sẽ hoàn trả 100% kèm văn bản đính chính!'",
        choices: [
          {
            id: "choice_transfer_300m",
            text: "Ra ngân hàng làm thủ tục rút tiết kiệm chuyển 300 triệu vào tài khoản đối tượng chỉ định.",
            next_node_id: "node_loss_disaster",
            is_safe: false,
            feedback: "Bẫy lừa hoàn tất! Toàn bộ 300 triệu dưỡng già đã bị chuyển qua nhiều tầng tài khoản rác và rút sạch."
          },
          {
            id: "choice_stop_bank_teller",
            text: "Xác minh: Nhận thức rằng cơ quan nhà nước KHÔNG BAO GIỜ có tài khoản cá nhân để 'giám định tiền', lập tức cúp máy và báo cho nhân viên ngân hàng.",
            next_node_id: "node_safe_resolved",
            is_safe: true,
            feedback: "Xử lý tuyệt vời ở phút chót! Cứu được toàn bộ 300 triệu đồng tiền mồ hôi nước mắt."
          }
        ]
      },

      node_safe_resolved: {
        id: "node_safe_resolved",
        prompt: "XỬ LÝ AN TOÀN THÀNH CÔNG: Bạn đã kiên định áp dụng quy tắc: Không hoang mang -> Không làm việc qua điện thoại -> Không chuyển tiền vào bất kỳ tài khoản lạ nào.",
        is_terminal: true,
        final_outcome: "safe",
        choices: []
      },

      node_loss_disaster: {
        id: "node_loss_disaster",
        prompt: "CẢNH BÁO THIỆT HẠI: Bị chiếm đoạt 300 triệu đồng! Kẻ giả danh lập tức khóa số, chặn liên lạc. Tiền chuyển đi không thể thu hồi được vì đã qua các tài khoản ma.",
        is_terminal: true,
        final_outcome: "compromised",
        choices: []
      }
    }
  },
  correct_answer: "node_safe_resolved",
  feedback: {
    core_rule: "Dừng lại",
    empathy_note: "Kẻ lừa đảo sử dụng kỹ thuật 'Thao túng tâm lý bằng uy quyền giả mạo' (Authority Bias Exploitation) kết hợp âm thanh hối hả, quát nạt để dồn nạn nhân vào trạng thái 'Chiến hay Biến' (Fight or Flight). Với người cao tuổi, nỗi sợ làm ảnh hưởng danh dự gia đình là điểm yếu bị chúng khai thác triệt để. Bạn hoặc người thân bị hoang mang trong tình cảnh này là điều hoàn toàn dễ hiểu và không có lỗi!",
    red_flags: [
      "Làm việc, lấy cung, đe dọa khởi tố, tống đạt Lệnh Bắt Tạm Giam qua điện thoại / mạng xã hội Zalo",
      "Ép buộc giữ bí mật tuyệt đối, không được thông báo cho con cháu hay người thân",
      "Yêu cầu chuyển tiền vào 'tài khoản tạm giữ / tài khoản thanh tra điều tra' (Pháp luật Việt Nam hoàn toàn không có thủ tục này)"
    ],
    safe_action: "Dập máy ngay lập tức. Chia sẻ ngay với con cháu trong nhà hoặc đến trực tiếp Công an Phường nơi cư trú để trình báo.",
    hotline_or_official_channel: "Đường dây nóng Cảnh sát: 113 | Tổng đài phản ánh tin nhắn & cuộc gọi rác: 156"
  },
  consequence: {
    title: "Mất trắng 300 triệu đồng tiết kiệm tích lũy cả đời",
    description: "Tiền bị luân chuyển qua các tài khoản ngân hàng rác và đổi thành tiền mã hóa chỉ trong vài phút, gây thiệt hại tài chính nặng nề và khủng hoảng tâm lý kéo dài cho người cao tuổi.",
    severity: "critical"
  }
};

// 2. Q1.3 - HOTSPOT QUESTION
// Tin nhắn Zalo yêu cầu cập nhật VNeID giả qua link vneid-capnhat.top/app.apk
export const SCENARIO_Q1_3: Scenario = {
  scenario_id: "Q1.3",
  category: "malicious_app_link",
  category_name_vi: "Mã độc dịch vụ công / Cài file .APK giả",
  skill: "Soi xét dấu hiệu giả mạo trên tin nhắn kích hoạt VNeID (Tên miền giả mạo & Tệp thực thi .apk)",
  difficulty: "beginner",
  question_type: "hotspot",
  context: "Chị Lan nhận được tin nhắn qua Zalo từ tài khoản có ảnh đại diện là huy hiệu Công an Nhân dân, thông báo hồ sơ định danh điện tử VNeID mức 2 của chị bị sai lệch thông tin cư trú và yêu cầu cập nhật trực tuyến gấp trong ngày.",
  stimulus: {
    type: "chat",
    sender: "Cán Bộ Hỗ Trợ VNeID - Quận Hoàn Kiếm",
    sender_avatar: "badge_police",
    timestamp: "14:20 - Hôm nay",
    content: "Chào công dân! Hồ sơ VNeID mức 2 của bạn trên hệ thống CSDL Quốc gia đang bị lỗi đồng bộ bảo hiểm y tế. Bạn vui lòng truy cập đường dẫn: https://vneid-capnhat.top/app.apk để tải bản vá cập nhật trước 17h00 hôm nay, nếu không sẽ bị khóa mã định danh cá nhân.",
    metadata: {
      "Yêu cầu người chơi": "Click trực tiếp vào 2 điểm nguy hiểm đáng ngờ nhất trên tin nhắn mô phỏng"
    }
  },
  options: {
    hotspots: [
      {
        id: "spot_fake_domain",
        title: "Địa chỉ web: https://vneid-capnhat.top",
        x: 32,
        y: 60,
        width: 36,
        height: 12,
        is_suspicious: true,
        clue: "Dấu hiệu bẫy: Tên miền có đuôi lạ '.top' (vneid-capnhat.top). Mọi cổng dịch vụ công chính thống của Nhà nước bắt buộc phải dùng đuôi '.gov.vn'."
      },
      {
        id: "spot_apk_extension",
        title: "Đường dẫn tệp tải về: /app.apk",
        x: 68,
        y: 60,
        width: 24,
        height: 12,
        is_suspicious: true,
        clue: "Dấu hiệu bẫy: Đuôi tệp là '.apk'. Cơ quan chức năng không bao giờ gửi link tải file cài đặt ngoài qua Zalo. Ứng dụng VNeID chỉ được tải từ Google Play hoặc App Store."
      },
      {
        id: "spot_avatar",
        title: "Ảnh đại diện: Huy hiệu Công an",
        x: 4,
        y: 8,
        width: 14,
        height: 25,
        is_suspicious: false,
        clue: "Ảnh đại diện không phải căn cứ xác thực: Kẻ lừa đảo có thể dễ dàng tải ảnh công an trên mạng về làm avatar để tạo lòng tin."
      },
      {
        id: "spot_deadline_threat",
        title: "Yêu cầu: Cập nhật gấp trước 17h00",
        x: 22,
        y: 75,
        width: 60,
        height: 12,
        is_suspicious: false,
        clue: "Chiêu trò tâm lý: Thúc ép thời gian để bạn hoảng sợ, không kịp hỏi ý kiến người thân hoặc cơ quan công an."
      }
    ]
  },
  correct_answer: ["spot_fake_domain", "spot_apk_extension"],
  feedback: {
    core_rule: "Kiểm tra",
    empathy_note: "Trang web và tin nhắn được ngụy trang rất khéo léo với ngôn từ hành chính quen thuộc ('lỗi đồng bộ cư trú', 'CSDL Quốc gia'). Rất nhiều người trẻ am hiểu công nghệ cũng từng suýt mắc bẫy vì tâm lý sợ bị khóa giấy tờ tùy thân. Hãy tự hào vì bạn đang rèn luyện đôi mắt tinh tường để phát hiện nguy cơ!",
    red_flags: [
      "Tên miền giả mạo có đuôi lạ (.top, .site, .vip, .cc) thay vì tên miền chính phủ .gov.vn",
      "Yêu cầu tải tệp ứng dụng cài ngoài (.apk) thay vì cài qua chợ ứng dụng chính thức Google Play / Apple App Store",
      "Cán bộ công an không bao giờ gửi link phần mềm qua tin nhắn Zalo cá nhân để yêu cầu người dân tự cài đặt"
    ],
    safe_action: "Không nhấp vào link, không tải hoặc mở file .apk. Nếu lỡ cài đặt, lập tức bật chế độ máy bay, ngắt Wi-Fi và mang máy đến trung tâm sửa chữa uy tín để chạy lại phần mềm.",
    hotline_or_official_channel: "Cổng thông tin VNeID chính thức: vneid.gov.vn | Tổng đài hỗ trợ VNeID: 1900 0368"
  },
  consequence: {
    title: "Điện thoại bị chiếm toàn quyền điều khiển từ xa và rút cạn tài khoản ngân hàng",
    description: "Tệp .apk giả mạo chứa mã độc Trojan sẽ yêu cầu cấp quyền Trợ năng (Accessibility Service). Khi được cấp quyền, hacker có thể tự ý đọc mã OTP qua tin nhắn, tự mở app ngân hàng chuyển tiền trong lúc nạn nhân đang ngủ mà không hề hay biết.",
    severity: "critical"
  }
};

// 3. Q2.2 - MULTIPLE CHOICE
// Phân biệt URL thật/giả của ngân hàng ABC với đuôi .cc
export const SCENARIO_Q2_2: Scenario = {
  scenario_id: "Q2.2",
  category: "bank_otp_fraud",
  category_name_vi: "Giả mạo ngân hàng / Chiếm đoạt mã OTP",
  skill: "Kỹ năng soi và phân biệt đường dẫn URL website ngân hàng chính thống và website mạo danh (Phishing)",
  difficulty: "beginner",
  question_type: "multiple_choice",
  context: "Bạn nhận được email cảnh báo bảo mật: 'Tài khoản ngân hàng ABC Bank của quý khách cần nâng cấp sinh trắc học theo Quyết định 2345/QĐ-NHNN để tránh bị gián đoạn giao dịch'. Email đính kèm liên kết đăng nhập. Đâu là đường dẫn lừa đảo nguy hiểm bạn TUYỆT ĐỐI KHÔNG ĐƯỢC NHẬP THÔNG TIN?",
  stimulus: {
    type: "browser",
    sender: "Bảo mật Ngân hàng ABC",
    timestamp: "08:30 - Sáng nay",
    content: "Đường link trong thư: https://abc-bank.com.vn.ebanking-update.cc/login",
    suspicious_url: "https://abc-bank.com.vn.ebanking-update.cc/login",
    metadata: {
      "Cấu trúc URL": "https://abc-bank.com.vn.ebanking-update.cc/login",
      "Tên miền gốc thực sự": "ebanking-update.cc (Tên miền cấp cao nhất là .cc)",
      "Đặc điểm ngụy trang": "Chèn chuỗi 'abc-bank.com.vn' vào subdomain phía trước để đánh lừa mắt thường"
    }
  },
  options: {
    multiple_choice: [
      {
        id: "opt_safe_real",
        label: "A. https://ebanking.abc-bank.com.vn/auth/login",
        is_correct: false,
        explanation: "Đây là đường link CHÍNH THỐNG an toàn: Tên miền gốc là 'abc-bank.com.vn' với subdomain dịch vụ 'ebanking'."
      },
      {
        id: "opt_fake_cc",
        label: "B. https://abc-bank.com.vn.ebanking-update.cc/login",
        is_correct: true,
        explanation: "CHÍNH XÁC! Đây là URL LỪA ĐẢO NGUY HIỂM: Tên miền gốc thực sự nằm ở cuối cùng trước dấu gạch chéo (/), tức là 'ebanking-update.cc'. Cụm 'abc-bank.com.vn' chỉ là tiền tố giả mạo!"
      },
      {
        id: "opt_app_internal",
        label: "C. Mở trực tiếp ứng dụng ABC Mobile Banking đã cài sẵn từ App Store / CH Play",
        is_correct: false,
        explanation: "Đây là phương thức an toàn nhất để thực hiện cập nhật sinh trắc học, không phải link lừa đảo."
      },
      {
        id: "opt_official_portal",
        label: "D. https://www.abc-bank.com.vn",
        is_correct: false,
        explanation: "Đây là trang chủ chính thống của ngân hàng ABC kết thúc bằng đuôi tên miền quốc gia .com.vn."
      }
    ]
  },
  correct_answer: "opt_fake_cc",
  feedback: {
    core_rule: "Kiểm tra",
    empathy_note: "Kỹ thuật đánh lừa thị giác bằng cách nhét tên thương hiệu uy tín vào đầu tên miền con (Subdomain Phishing) là thủ đoạn rất tinh vi của tội phạm mạng quốc tế. Ngay cả chuyên gia đôi khi lướt nhanh trên màn hình điện thoại nhỏ cũng có thể nhầm lẫn. Việc bạn dừng lại soi kỹ tên miền là tấm lá chắn tốt nhất!",
    red_flags: [
      "Tên miền thật luôn nằm ngay sát dấu gạch chéo đầu tiên sau tên miền (Trong URL này là 'ebanking-update.cc')",
      "Sử dụng đuôi tên miền lạ quốc tế (.cc - Quần đảo Cocos) cho dịch vụ ngân hàng tại Việt Nam",
      "Ngân hàng không bao giờ yêu cầu cập nhật sinh trắc học qua website trung gian gửi trong email"
    ],
    safe_action: "Tuyệt đối không nhấp vào đường link. Vào trực tiếp ứng dụng ngân hàng chính thức trên điện thoại để kiểm tra mục Cài đặt Sinh trắc học.",
    hotline_or_official_channel: "Số hotline in trên mặt sau thẻ ATM của ngân hàng bạn sử dụng."
  },
  consequence: {
    title: "Lộ toàn bộ Tên đăng nhập, Mật khẩu và Mã OTP ngân hàng",
    description: "Khi người dùng nhập mật khẩu vào trang web giả mạo đuôi .cc, thông tin sẽ được truyền trực tiếp về máy chủ của tin tặc. Kẻ gian lập tức đăng nhập vào app ngân hàng thật và chuyển sạch tiền trong tài khoản.",
    severity: "critical"
  }
};
