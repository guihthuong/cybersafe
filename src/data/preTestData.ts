export interface PreTestQuestion {
  id: number;
  category: string;
  question: string;
  context: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export const PRE_TEST_QUESTIONS: PreTestQuestion[] = [
  {
    id: 1,
    category: "Gây sốc tâm lý & Ép buộc chuyển tiền",
    question: "Bạn nhận được cuộc gọi từ người tự xưng là bác sĩ/giáo viên thông báo con bạn bị tai nạn nguy kịch đang cấp cứu tại bệnh viện và yêu cầu chuyển gấp 30 triệu đồng để mổ. Bạn nên làm gì trước tiên?",
    context: "Kẻ gian thường gọi điện trong giờ học hoặc giờ làm việc, dùng tiếng còi cứu thương giả tạo và giọng hốt hoảng để gây tê liệt lý trí nạn nhân.",
    options: [
      "Chuyển ngay tiền vào số tài khoản cá nhân do người gọi cung cấp vì mạng người là quan trọng nhất.",
      "Giữ bình tĩnh, không chuyển tiền; ngắt máy và gọi trực tiếp cho nhà trường, giáo viên chủ nhiệm hoặc người thân để xác minh.",
      "Đăng tin lên mạng xã hội cầu cứu để xin hỗ trợ quyên góp viện phí.",
      "Yêu cầu người gọi chụp ảnh chứng minh nhân dân gửi qua Zalo rồi mới chuyển tiền."
    ],
    correctOption: 1,
    explanation: "Đây là chiêu trò lừa đảo 'Con đang cấp cứu' kinh điển. Các bệnh viện tại Việt Nam luôn ưu tiên cấp cứu tính mạng bệnh nhân trước. Tuyệt đối không chuyển tiền theo số tài khoản lạ do người gọi cung cấp; luôn gọi điện trực tiếp xác minh qua nhà trường hoặc bệnh viện."
  },
  {
    id: 2,
    category: "Giả danh cơ quan công quyền",
    question: "Một người gọi điện tự xưng là cán bộ Công an điều tra, thông báo số điện thoại/CMND của bạn liên quan đến vụ án rửa tiền và yêu cầu chuyển toàn bộ tiền vào 'Tài khoản tạm giữ' để thanh tra. Điều này đúng hay sai?",
    context: "Kẻ lừa đảo thường mặc quân phục gọi video qua Zalo, gửi lệnh bắt giả mạo có mộc đỏ và đe dọa khởi tố nếu tiết lộ cho người khác.",
    options: [
      "Đúng, vì đây là quy trình niêm phong tài sản phục vụ điều tra của cơ quan pháp luật.",
      "Sai hoàn toàn. Cơ quan Công an Việt Nam không bao giờ làm việc qua điện thoại và không bao giờ yêu cầu chuyển tiền vào tài khoản cá nhân.",
      "Đúng nếu người đó gửi ảnh thẻ ngành và quyết định khởi tố có đóng dấu đỏ qua Zalo.",
      "Tùy trường hợp, nếu số tiền ít thì không sao."
    ],
    correctOption: 1,
    explanation: "Công an, Viện kiểm sát và Tòa án tại Việt Nam chỉ làm việc trực tiếp tại trụ sở thông qua giấy triệu tập hoặc giấy mời bằng văn bản gửi về địa phương, tuyệt đối không làm việc qua điện thoại, không gửi lệnh bắt qua Zalo và không có tài khoản tạm giữ nào yêu cầu chuyển tiền."
  },
  {
    id: 3,
    category: "Bảo mật tài khoản & Mã OTP",
    question: "Người tự xưng là nhân viên kỹ thuật ngân hàng gọi đến báo tài khoản của bạn đang bị trừ tiền bất thường và yêu cầu bạn đọc mã OTP gửi về điện thoại để 'hủy lệnh chuyển tiền'. Bạn xử lý thế nào?",
    context: "Mã OTP (One Time Password) là mật khẩu dùng một lần để ký duyệt giao dịch rút tiền hoặc đổi mật khẩu tài khoản.",
    options: [
      "Đọc ngay mã OTP để kịp thời chặn giao dịch trừ tiền của kẻ gian.",
      "Tuyệt đối không đọc OTP. Nhân viên ngân hàng không bao giờ được phép hỏi mã OTP của khách hàng dưới bất kỳ hình thức nào.",
      "Đọc nửa số đầu của OTP, khi nào hủy xong lệnh thì đọc tiếp phần còn lại.",
      "Gửi ảnh chụp màn hình tin nhắn OTP qua tin nhắn SMS cho nhân viên."
    ],
    correctOption: 1,
    explanation: "Mã OTP là lớp bảo vệ cuối cùng của tài khoản ngân hàng. Khi bạn đọc OTP, bạn đã giao quyền cho kẻ gian chuyển sạch tiền trong tài khoản của mình. Mọi cuộc gọi hỏi mã OTP đều là 100% lừa đảo."
  },
  {
    id: 4,
    category: "Mã độc thiết bị & Ứng dụng giả mạo",
    question: "Bạn nhận được hướng dẫn bấm vào một đường link lạ để tải file cài đặt có đuôi '.apk' về điện thoại Android nhằm cập nhật định danh điện tử VNeID mức 2. Nguy cơ lớn nhất là gì?",
    context: "Tệp .apk là gói cài đặt ứng dụng Android bên ngoài chợ ứng dụng chính thức Google Play.",
    options: [
      "Không có nguy cơ vì VNeID là ứng dụng của Bộ Công an phát hành.",
      "Thiết bị sẽ bị cài mã độc gián điệp, bị chiếm quyền trợ năng (Accessibility), đọc trộm tin nhắn OTP và bị kẻ gian điều khiển rút tiền từ xa.",
      "Chỉ làm tốn dung lượng bộ nhớ máy chứ không thể can thiệp vào tài khoản ngân hàng.",
      "Ứng dụng sẽ tự động xóa sau 24 giờ nếu không sử dụng."
    ],
    correctOption: 1,
    explanation: "Ứng dụng VNeID chỉ được phát hành duy nhất trên Google Play (Android) và App Store (iOS). Bất kỳ hướng dẫn tải file .apk từ trang web ngoài đều cài mã độc chiếm quyền điều khiển điện thoại để tự động đăng nhập app ngân hàng và rút tiền khi nạn nhân không hay biết."
  },
  {
    id: 5,
    category: "Trí tuệ nhân tạo (Deepfake AI)",
    question: "Bạn nhận được cuộc gọi video từ tài khoản Facebook của bạn thân hỏi vay gấp 10 triệu đồng. Khuôn mặt và giọng nói giống hệt bạn của bạn nhưng hình ảnh hơi mờ và cuộc gọi cúp máy sau vài giây. Hành động an toàn nhất là gì?",
    context: "Kẻ gian chiếm đoạt tài khoản Facebook rồi dùng công nghệ Deepfake AI tạo video khuôn mặt cử động và giả giọng nói để tạo lòng tin.",
    options: [
      "Chuyển tiền ngay vì đã nhìn thấy mặt và nghe giọng nói chính xác qua video call.",
      "Lấy điện thoại di động thông thường gọi vào số thuê bao viễn thông của người bạn đó (hoặc gặp trực tiếp) để hỏi rõ sự việc trước khi quyết định.",
      "Nhắn tin hỏi số tài khoản trên Messenger rồi chuyển luôn.",
      "Chuyển một nửa số tiền để kiểm tra xem có đúng là bạn mình không."
    ],
    correctOption: 1,
    explanation: "Công nghệ Deepfake cho phép giả mạo hình ảnh khuôn mặt và giọng nói của bất kỳ ai chỉ sau vài giây video mẫu. Để kiểm chứng, hãy gọi điện thoại mạng viễn thông thông thường hoặc gọi vào số điện thoại lưu từ trước trong danh bạ."
  },
  {
    id: 6,
    category: "Bẫy việc làm & Hoa hồng ảo",
    question: "Một bài đăng tuyển dụng 'Cộng tác viên xử lý đơn hàng Shopee/Tiktok tại nhà, kiếm 300.000 - 800.000đ/ngày'. Ban đầu nạp 200.000đ nhận lại được 250.000đ, nhưng sau đó đơn hàng lên đến hàng chục triệu và bị khóa tiền nộp tiếp. Đây là hình thức gì?",
    context: "Chiêu trò thả mồi câu: cho nạn nhân ăn lãi nhỏ ở 1-2 đơn đầu tiên để lấy lòng tin, sau đó nâng hạn mức tiền nạp lên cao rồi ôm tiền biến mất.",
    options: [
      "Là mô hình thương mại điện tử liên kết hoàn toàn hợp pháp.",
      "Là bẫy lừa đảo nạp tiền làm nhiệm vụ giật đơn hàng hoàn tiền hoa hồng ảo.",
      "Do hệ thống ngân hàng bị nghẽn lệnh, nạp thêm tiền theo yêu cầu sẽ rút được hết.",
      "Là lỗi kỹ thuật của sàn thương mại điện tử, chỉ cần đợi 3 ngày là nhận lại tiền."
    ],
    correctOption: 1,
    explanation: "Tất cả các lời mời 'Việc nhẹ lương cao - nạp tiền làm nhiệm vụ ăn hoa hồng' đều là mô hình lừa đảo tài chính Ponzi. Các sàn TMĐT lớn như Shopee, Lazada, TikTok đều không có chương trình cộng tác viên nạp tiền tài khoản cá nhân."
  },
  {
    id: 7,
    category: "Bẫy trúng thưởng & Quà tri ân",
    question: "Bạn nhận được tin nhắn thông báo trúng giải đặc biệt xe máy SH từ chương trình tri ân khách hàng, nhưng để nhận giải bạn phải đóng trước 3 triệu đồng tiền 'phí vận chuyển và thuế thu nhập'. Bạn nên xử lý thế nào?",
    context: "Kẻ gian đánh vào tâm lý hám lợi của nạn nhân để chiếm đoạt số tiền phí đặt cọc nộp trước.",
    options: [
      "Nhanh chóng chuyển 3 triệu vì giá trị chiếc xe SH lớn hơn số tiền thuế rất nhiều.",
      "Không nộp bất kỳ khoản tiền nào. Yêu cầu nếu có trúng thưởng thật thì trừ tiền thuế trực tiếp vào hiện vật hoặc nhận thưởng tại cơ quan có thẩm quyền.",
      "Mượn tiền người thân để chuyển phí nhanh kẻo hết hạn nhận giải.",
      "Gửi thông tin thẻ ngân hàng và mật khẩu cho bên trao giải để họ tự trừ tiền."
    ],
    correctOption: 1,
    explanation: "Không có giải thưởng thật nào bắt buộc nộp phí vào tài khoản cá nhân của người lạ. Mọi yêu cầu 'nộp tiền phí trước để nhận quà khủng' đều là bẫy lừa tiền cọc."
  },
  {
    id: 8,
    category: "Đường link lạ & Website giả mạo (Phishing)",
    question: "Dấu hiệu nhận diện quan trọng nhất để phát hiện một đường link giả mạo ngân hàng hoặc cơ quan nhà nước là gì?",
    context: "Trang web phishing sao chép giao diện y hệt ngân hàng thật để đánh cắp tên đăng nhập và mật khẩu khi người dùng gõ vào.",
    options: [
      "Màu sắc và logo của trang web có đẹp mắt hay không.",
      "Tên miền hiển thị trên thanh địa chỉ trình duyệt (ví dụ: cơ quan nhà nước tại Việt Nam luôn có đuôi chính thức là .gov.vn; ngân hàng lớn có tên miền đăng ký rõ ràng, không dùng đuôi lạ như .top, .vip, .cc, .xyz).",
      "Trang web có chạy mượt mà và tải nhanh hay không.",
      "Trang web có hiển thị hình ảnh quốc huy hoặc cờ đỏ sao vàng hay không."
    ],
    correctOption: 1,
    explanation: "Kẻ lừa đảo có thể sao chép giao diện và logo trong vài phút, nhưng tên miền (Domain Name) trên thanh địa chỉ trình duyệt là duy nhất. Cơ quan nhà nước Việt Nam luôn có tên miền tận cùng bằng .gov.vn."
  },
  {
    id: 9,
    category: "Mã QR độc hại (Quishing)",
    question: "Tại quán ăn hoặc điểm công cộng, bạn thấy mã QR thanh toán bị dán đè một lớp mã QR khác lên trên. Hành vi an toàn nhất khi thanh toán là gì?",
    context: "Kẻ gian in mã QR của tài khoản cá nhân mình rồi lén dán đè lên mã QR của chủ quán để hứng tiền chuyển khoản.",
    options: [
      "Cứ quét bình thường và chuyển tiền ngay vì mã nào cũng thanh toán được.",
      "Quan sát kỹ trước khi quét, nếu thấy có vết dán đè thì hỏi lại chủ quán; sau khi quét trên app ngân hàng phải đọc to tên chủ tài khoản thụ hưởng để chủ quán xác nhận trước khi bấm chuyển.",
      "Chụp ảnh mã QR gửi cho bạn bè quét hộ.",
      "Nhập mật khẩu OTP 2 lần để đảm bảo tiền vào đúng chỗ."
    ],
    correctOption: 1,
    explanation: "Chiêu trò dán đè mã QR tại các hàng quán đang diễn ra phổ biến. Người mua cần luôn đối chiếu tên người nhận hiển thị trên ứng dụng ngân hàng với tên thật của chủ cửa hàng trước khi nhập mã xác nhận."
  },
  {
    id: 10,
    category: "An toàn kết nối Wi-Fi công cộng",
    question: "Khi kết nối vào mạng Wi-Fi công cộng miễn phí không có mật khẩu (tại quán cà phê, quảng trường, sân bay), hành động nào sau đây là NGUY HIỂM NHẤT?",
    context: "Kẻ tấn công có thể dựng trạm phát Wi-Fi giả mạo (Rogue AP) để bắt gói tin, nghe lén lưu lượng mạng chưa mã hóa.",
    options: [
      "Đọc báo xem tin tức thời sự trên các trang báo điện tử chính thống.",
      "Đăng nhập tài khoản ngân hàng và thực hiện giao dịch chuyển tiền trực tuyến mà không bật VPN bảo mật.",
      "Tắt Bluetooth và chức năng chia sẻ file lân cận.",
      "Xem video hướng dẫn nấu ăn trên YouTube."
    ],
    correctOption: 1,
    explanation: "Tuyệt đối không đăng nhập tài khoản nhạy cảm, không gõ mật khẩu ngân hàng hoặc thực hiện giao dịch tài chính qua mạng Wi-Fi công cộng mở, trừ khi sử dụng mạng di động 4G/5G riêng tư của bản thân hoặc kết nối qua kênh mã hóa VPN an toàn."
  }
];

export function calculateCompetencyScale(score: number): {
  level: string;
  badge: string;
  description: string;
  recommendations: string[];
} {
  if (score >= 9) {
    return {
      level: "Bậc 5: Xuất Sắc (Phản Xạ Số Vững Vàng)",
      badge: "Chuyên Gia Tự Vệ Số",
      description: "Bạn sở hữu nhận thức an toàn số cực kỳ sắc bén, nắm chắc các phương thức lừa đảo thao túng tâm lý và bảo vệ thông tin cá nhân chuẩn mực.",
      recommendations: [
        "Tiếp tục thử sức với các bài tập phân nhánh phức tạp (Branching Scenario).",
        "Trở thành đại sứ an toàn số, hướng dẫn người thân và người cao tuổi trong gia đình."
      ]
    };
  } else if (score >= 7) {
    return {
      level: "Bậc 4: Khá (Nhận Biết Rủi Ro Tốt)",
      badge: "Học Viên Nòng Cốt",
      description: "Bạn đã nhận diện được hầu hết các chiêu trò lừa đảo phổ biến, tuy nhiên vẫn cần cảnh giác trước các thủ đoạn Deepfake AI và mã độc thiết bị tinh vi.",
      recommendations: [
        "Rèn luyện thêm các ải về Mã độc .APK và Deepfake giả giọng nói.",
        "Hình thành thói quen kiểm tra tên miền .gov.vn trên thanh địa chỉ."
      ]
    };
  } else if (score >= 4) {
    return {
      level: "Bậc 3: Cơ Bản (Dễ Tổn Thương Trước Chiêu Trò Mới)",
      badge: "Người Học Tiềm Năng",
      description: "Bạn đã có nhận thức nền tảng về an toàn số nhưng dễ bị dao động trước các tình huống gây sốc tâm lý (đe dọa, cấp cứu) hoặc bẫy hoa hồng tài chính.",
      recommendations: [
        "Học kỹ quy tắc 4 bước: Dừng lại - Kiểm tra - Xác minh - Hành động.",
        "Luôn ghi nhớ: Không bao giờ cung cấp mã OTP và không cài app ngoài chợ chính thống."
      ]
    };
  } else {
    return {
      level: "Bậc 1-2: Cần Hỗ Trợ Đặc Biệt (Nguy Cơ Cao)",
      badge: "Tân Binh Cần Bảo Vệ",
      description: "Năng lực phòng ngừa rủi ro số của bạn còn nhiều khoảng trống nguy hiểm, rất dễ trở thành nạn nhân của các nhóm tội phạm công nghệ cao.",
      recommendations: [
        "Hoàn thành trọn vẹn 39 ải theo lộ trình từ Chương 1 đến Chương 7.",
        "Sử dụng trợ lý CyberGuardBot thường xuyên mỗi khi gặp tin nhắn hay cuộc gọi lạ."
      ]
    };
  }
}
