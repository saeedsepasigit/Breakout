// دریافت عنصر canvas از DOM با استفاده از id آن
const canvas = document.getElementById('gameCanvas');
// گرفتن context دوبعدی برای نقاشی روی canvas
const ctx = canvas.getContext('2d');
// دریافت دکمه شروع بازی از DOM با استفاده از id آن
const startButton = document.getElementById('startButton');

// تنظیم اندازه شعاع توپ
let ballRadius = 5; // اندازه توپ را به 5 تغییر دادیم
// موقعیت اولیه توپ روی محور x و y
let x = canvas.width / 2;
// تنظیم موقعیت اولیه توپ در پایین صفحه
let y = canvas.height - 30;
// تنظیم سرعت حرکت توپ در جهت x (مثبت به معنای حرکت به سمت راست)
let dx = 4;
// تنظیم سرعت حرکت توپ در جهت y (منفی به معنای حرکت به سمت بالا)
let dy = -4;

// تنظیم ارتفاع پدال
let paddleHeight = 15;
// تنظیم عرض پدال
let paddleWidth = 100;
// تنظیم موقعیت اولیه پدال در محور x (وسط صفحه)
let paddleX = (canvas.width - paddleWidth) / 2;

// متغیر برای نگهداری وضعیت فشار دادن کلید جهت راست
let rightPressed = false;
// متغیر برای نگهداری وضعیت فشار دادن کلید جهت چپ
let leftPressed = false;

// تنظیم تعداد ردیف‌های آجرها
let brickRowCount = 5;
// تنظیم تعداد ستون‌های آجرها
let brickColumnCount = 8;
// تنظیم عرض آجرها
let brickWidth = 80;
// تنظیم ارتفاع آجرها
let brickHeight = 30;
// تنظیم فاصله بین آجرها
let brickPadding = 15;
// تنظیم فاصله از بالا برای اولین ردیف آجرها
let brickOffsetTop = 30;
// تنظیم فاصله از چپ برای اولین ستون آجرها
let brickOffsetLeft = 30;

// ایجاد آرایه برای ذخیره آجرها
let bricks = [];
// محاسبه تعداد کل آجرها
let totalBricks = brickRowCount * brickColumnCount;

// حلقه برای ایجاد آجرها و تنظیم موقعیت و وضعیت هر آجر
for(let c = 0; c < brickColumnCount; c++) {
    // ایجاد آرایه برای هر ستون آجرها
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        // ایجاد هر آجر با وضعیت فعال (status: 1) و موقعیت اولیه (x: 0, y: 0)
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// اضافه کردن رویداد گوش دادن به فشار دادن کلیدهای جهت‌دار
document.addEventListener("keydown", keyDownHandler, false);
// اضافه کردن رویداد گوش دادن به رها کردن کلیدهای جهت‌دار
document.addEventListener("keyup", keyUpHandler, false);
// اضافه کردن رویداد گوش دادن به کلیک دکمه شروع بازی
startButton.addEventListener("click", startGame);

// تابعی برای مدیریت رویداد فشار دادن کلیدهای جهت‌دار
function keyDownHandler(e) {
    // اگر کلید فشار داده شده راست باشد، وضعیت rightPressed را true می‌کنیم
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    // اگر کلید فشار داده شده چپ باشد، وضعیت leftPressed را true می‌کنیم
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// تابعی برای مدیریت رویداد رها کردن کلیدهای جهت‌دار
function keyUpHandler(e) {
    // اگر کلید رها شده راست باشد، وضعیت rightPressed را false می‌کنیم
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    // اگر کلید رها شده چپ باشد، وضعیت leftPressed را false می‌کنیم
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// تابعی برای شروع بازی
function startGame() {
    // مخفی کردن دکمه شروع بازی
    startButton.style.display = 'none';
    // شروع به نقاشی و اجرای بازی
    draw();
}

// تابعی برای تشخیص برخورد توپ با آجرها
function collisionDetection() {
    // حلقه برای بررسی هر ستون آجرها
    for(let c = 0; c < brickColumnCount; c++) {
        // حلقه برای بررسی هر ردیف آجرها
        for(let r = 0; r < brickRowCount; r++) {
            // گرفتن آجر فعلی
            let b = bricks[c][r];
            // بررسی اینکه آیا آجر فعال است یا نه
            if (b.status == 1) {
                // بررسی برخورد توپ با آجر
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    // تغییر جهت حرکت توپ در محور y
                    dy = -dy;

                    // تصحیح موقعیت توپ برای جلوگیری از عبور
                    if (y + dy > b.y + brickHeight) {
                        y = b.y + brickHeight;
                    } else if (y - dy < b.y) {
                        y = b.y - ballRadius;
                    }

                    // تصحیح موقعیت توپ برای جلوگیری از عبور
                    if (x + dx > b.x + brickWidth) {
                        x = b.x + brickWidth;
                    } else if (x - dx < b.x) {
                        x = b.x - ballRadius;
                    }

                    // غیر فعال کردن آجر
                    b.status = 0;
                    // کاهش تعداد کل آجرها
                    totalBricks--;
                    // بررسی بردن بازی (از بین رفتن تمام آجرها)
                    if (totalBricks === 0) {
                        // نمایش پیام برنده شدن و شروع دوباره بازی
                        alert("شما برنده شدید! بازی دوباره شروع می‌شود.");
                        resetGame();
                    }
                }
            }
        }
    }
}

// تابعی برای رسم توپ
function drawBall() {
    // شروع مسیر جدید برای رسم
    ctx.beginPath();
    // رسم یک دایره برای توپ با موقعیت x, y و شعاع ballRadius
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    // تنظیم رنگ داخلی توپ
    ctx.fillStyle = "#ff6f61";
    // تنظیم رنگ دور توپ
    ctx.strokeStyle = "#ff5722";
    // تنظیم ضخامت خط دور توپ
    ctx.lineWidth = 3;
    // پر کردن توپ
    ctx.fill();
    // رسم خط دور توپ
    ctx.stroke();
    // بستن مسیر رسم
    ctx.closePath();
}

// تابعی برای رسم پدال
function drawPaddle() {
    // شروع مسیر جدید برای رسم
    ctx.beginPath();
    // رسم یک مستطیل برای پدال با موقعیت paddleX, canvas.height - paddleHeight و اندازه paddleWidth, paddleHeight
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    // تنظیم رنگ داخلی پدال
    ctx.fillStyle = "#4caf50";
    // تنظیم رنگ دور پدال
    ctx.strokeStyle = "#388e3c";
    // تنظیم ضخامت خط دور پدال
    ctx.lineWidth = 2;
    // پر کردن پدال
    ctx.fill();
    // رسم خط دور پدال
    ctx.stroke();
    // بستن مسیر رسم
    ctx.closePath();
}

// تابعی برای رسم آجرها
function drawBricks() {
    // حلقه برای رسم هر ستون آجرها
    for(let c = 0; c < brickColumnCount; c++) {
        // حلقه برای رسم هر ردیف آجرها
        for(let r = 0; r < brickRowCount; r++) {
            // بررسی اینکه آیا آجر فعال است یا نه
            if (bricks[c][r].status == 1) {
                // محاسبه موقعیت x آجر
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                // محاسبه موقعیت y آجر
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                // تنظیم موقعیت آجر
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                // شروع مسیر جدید برای رسم
                ctx.beginPath();
                // رسم یک مستطیل برای آجر
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                // تنظیم رنگ داخلی آجر
                ctx.fillStyle = "#03a9f4";
                // تنظیم رنگ دور آجر
                ctx.strokeStyle = "#0288d1";
                // تنظیم ضخامت خط دور آجر
                ctx.lineWidth = 2;
                // پر کردن آجر
                ctx.fill();
                // رسم خط دور آجر
                ctx.stroke();
                // بستن مسیر رسم
                ctx.closePath();
            }
        }
    }
}

// تابع اصلی برای رسم تمام عناصر بازی
function draw() {
    // پاک کردن تمام canvas برای رسم مجدد
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // رسم آجرها
    drawBricks();
    // رسم توپ
    drawBall();
    // رسم پدال
    drawPaddle();
    // تشخیص برخورد توپ با آجرها
    collisionDetection();

    // تغییر جهت توپ اگر به دیوارهای چپ یا راست برخورد کند
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // تغییر جهت توپ اگر به سقف برخورد کند
    if (y + dy < ballRadius) {
        dy = -dy;
    // بررسی برخورد توپ با پدال یا انتهای صفحه
    } else if (y + dy > canvas.height - ballRadius) {
        // اگر توپ با پدال برخورد کرد، تغییر جهت توپ
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        // اگر توپ با پدال برخورد نکرد و به پایین صفحه رسید، بازی را از نو شروع کن
        } else {
            document.location.reload();
        }
    }

    // حرکت دادن پدال به سمت راست اگر کلید راست فشار داده شده و پدال در انتهای صفحه نیست
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    // حرکت دادن پدال به سمت چپ اگر کلید چپ فشار داده شده و پدال در ابتدای صفحه نیست
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // حرکت دادن توپ
    x += dx;
    y += dy;

    // درخواست برای اجرای دوباره تابع draw در فریم بعدی
    requestAnimationFrame(draw);
}

// تابعی برای بازنشانی بازی
function resetGame() {
    // تنظیم مجدد اندازه توپ
    ballRadius = 5;
    // تنظیم موقعیت اولیه توپ
    x = canvas.width / 2;
    y = canvas.height - 30;
    // تنظیم سرعت حرکت توپ
    dx = 4;
    dy = -4;

    // تنظیم موقعیت اولیه پدال
    paddleX = (canvas.width - paddleWidth) / 2;

    // تنظیم مجدد تعداد کل آجرها
    totalBricks = brickRowCount * brickColumnCount;

    // ایجاد مجدد آرایه آجرها
    bricks = [];
    // حلقه برای ایجاد آجرها و تنظیم موقعیت و وضعیت هر آجر
    for(let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for(let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    // شروع به نقاشی و اجرای بازی
    draw();
}