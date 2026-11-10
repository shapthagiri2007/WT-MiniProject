Add-Type -AssemblyName System.Drawing

$imgDir = "C:\Users\ASUS TUFF\Downloads\WT Mini Project\report_images"
if (-not (Test-Path $imgDir)) {
    New-Item -ItemType Directory -Path $imgDir | Out-Null
}

function Save-Image($bmp, $filename) {
    $path = Join-Path $imgDir $filename
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Generated: $filename"
}

# Fonts
$fontTitle = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
$fontHead = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$fontText = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font("Arial", 8, [System.Drawing.FontStyle]::Regular)
$fontCode = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)

# Pens & Brushes
$penBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 70, 70), 2)
$penBorder2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 41, 59), 2)
$penDash = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 100, 100), 2)
$penDash.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$penArrow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 64, 175), 2)
$penArrow.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)

$brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(219, 234, 254))
$penBlue = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37, 99, 235), 2)
$brushGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 252, 231))
$penGreen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(22, 163, 74), 2)
$brushAmber = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 243, 199))
$penAmber = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(217, 119, 6), 2)
$brushPurple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(243, 232, 255))
$penPurple = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(147, 51, 234), 2)
$brushRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 226, 226))
$penRed = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(239, 68, 68), 2)
$brushServerBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))

$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center

# --- 1. Figure 3.1: Architecture Diagram ---
$bmp = New-Object System.Drawing.Bitmap 900, 500
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$brushBrowserBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($brushBrowserBg, 30, 30, 520, 440)
$g.DrawRectangle($penDash, 30, 30, 520, 440)
$g.DrawString("CLIENT TIER: CLIENT WEB BROWSER", $fontHead, $brushDark, 45, 42)

$g.FillRectangle($brushBlue, 55, 80, 220, 150)
$g.DrawRectangle($penBlue, 55, 80, 220, 150)
$g.DrawString("Presentation Layer", $fontHead, $brushDark, 65, 90)
$g.DrawString("• HTML5 Semantic Layout`n• Responsive CSS3 Styling`n• Hero & Tariff Slab Cards`n• Interactive Meter Form`n• Printable Invoice View", $fontText, $brushDark, 65, 120)

$g.FillRectangle($brushGreen, 305, 80, 225, 150)
$g.DrawRectangle($penGreen, 305, 80, 225, 150)
$g.DrawString("Business Logic Layer", $fontHead, $brushDark, 315, 90)
$g.DrawString("• JavaScript (ES6)`n• Input Validation Engine`n• Consumption Formula`n• Progressive Slab Engine`n• Dynamic DOM Renderer", $fontText, $brushDark, 315, 120)

$g.FillRectangle($brushAmber, 180, 270, 230, 140)
$g.DrawRectangle($penAmber, 180, 270, 230, 140)
$g.DrawString("Local Data Storage", $fontHead, $brushDark, 190, 280)
$g.DrawString("• Browser LocalStorage API`n• JSON Key-Value Store`n• eb_calc_history Records`n• Persistent Past Bills`n• Fast Client Retrieval", $fontText, $brushDark, 190, 310)

$g.DrawLine($penArrow, 275, 155, 305, 155)
$penArrowBi = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 64, 175), 2)
$penArrowBi.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
$g.DrawLine($penArrowBi, 415, 230, 415, 270)

$g.FillRectangle($brushServerBg, 620, 80, 250, 330)
$g.DrawRectangle($penBorder, 620, 80, 250, 330)
$g.DrawString("HOSTING / SERVER TIER", $fontHead, $brushDark, 635, 95)

$g.FillRectangle($brushPurple, 640, 140, 210, 120)
$g.DrawRectangle($penPurple, 640, 140, 210, 120)
$g.DrawString("Static Web Host", $fontHead, $brushDark, 650, 150)
$g.DrawString("• GitHub Pages / Web Server`n• HTTPS Delivery`n• index.html`n• style.css`n• script.js", $fontText, $brushDark, 650, 180)

$g.DrawString("Zero Backend Overhead`nPure Client Execution", $fontText, $brushDark, 650, 290)

$g.DrawLine($penArrow, 550, 170, 640, 170)
$penArrowLeft = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 2)
$penArrowLeft.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
$g.DrawLine($penArrowLeft, 640, 210, 550, 210)
$g.DrawString("HTTP GET Request", $fontSmall, $brushDark, 553, 150)
$g.DrawString("Static Assets (HTML/CSS/JS)", $fontSmall, $brushDark, 553, 215)
$g.Dispose()
Save-Image $bmp "fig3_1_architecture.png"

# --- 2. Figure 3.2: Use Case Diagram ---
$bmp = New-Object System.Drawing.Bitmap 800, 520
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(249, 250, 251))), 220, 20, 540, 480)
$g.DrawRectangle($penBorder2, 220, 20, 540, 480)
$g.DrawString("Electricity Bill Calculator System", $fontHead, $brushDark, 370, 30)

$penStick = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 41, 59), 2)
$g.DrawEllipse($penStick, 75, 180, 40, 40)
$g.DrawLine($penStick, 95, 220, 95, 280)
$g.DrawLine($penStick, 65, 245, 125, 245)
$g.DrawLine($penStick, 95, 280, 70, 340)
$g.DrawLine($penStick, 95, 280, 120, 340)
$g.DrawString("Electricity Consumer / User", $fontHead, $brushDark, 25, 355)

$useCases = @(
    "View Tariff Slab Rates",
    "Enter Consumer & Meter Readings",
    "Validate Meter Reading Inputs",
    "Calculate Units & Progressive Bill",
    "View Detailed Bill Summary & Breakdown",
    "Save Calculation to LocalStorage",
    "View / Delete Saved History Records",
    "Print Official Bill Invoice"
)

$penOval = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37, 99, 235), 2)
$penLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 116, 139), 1)

for ($i = 0; $i -lt $useCases.Length; $i++) {
    $y = 65 + ($i * 52)
    $g.FillEllipse($brushBlue, 290, $y, 380, 42)
    $g.DrawEllipse($penOval, 290, $y, 380, 42)
    $rect = New-Object System.Drawing.RectangleF 290, $y, 380, 42
    $g.DrawString($useCases[$i], $fontText, $brushDark, $rect, $sfCenter)
    $g.DrawLine($penLine, 125, 250, 290, ($y + 21))
}
$g.Dispose()
Save-Image $bmp "fig3_2_usecase.png"

# --- 3. Figure 3.3: DFD Level 0 ---
$bmp = New-Object System.Drawing.Bitmap 800, 360
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$g.FillRectangle($brushServerBg, 50, 110, 160, 100)
$g.DrawRectangle($penBorder2, 50, 110, 160, 100)
$rectEnt = New-Object System.Drawing.RectangleF 50, 110, 160, 100
$g.DrawString("Electricity`nConsumer", $fontHead, $brushDark, $rectEnt, $sfCenter)

$g.FillEllipse($brushBlue, 310, 80, 180, 160)
$g.DrawEllipse($penBlue, 310, 80, 180, 160)
$rectProc = New-Object System.Drawing.RectangleF 310, 80, 180, 160
$g.DrawString("0`nElectricity Bill`nCalculator System", $fontHead, $brushDark, $rectProc, $sfCenter)

$g.FillRectangle($brushAmber, 590, 110, 160, 100)
$g.DrawLine($penBorder, 590, 110, 750, 110)
$g.DrawLine($penBorder, 590, 210, 750, 210)
$g.DrawLine($penBorder, 620, 110, 620, 210)
$g.DrawString("D1", $fontHead, $brushDark, 595, 145)
$g.DrawString("Browser`nLocalStorage`n(eb_calc_history)", $fontText, $brushDark, 630, 135)

$g.DrawLine($penArrow, 210, 135, 310, 135)
$g.DrawString("Consumer Info & Meter Readings", $fontSmall, $brushDark, 140, 118)

$penArrowLeft2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 2)
$penArrowLeft2.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
$g.DrawLine($penArrowLeft2, 310, 185, 210, 185)
$g.DrawString("Bill Summary, Breakdown & Alerts", $fontSmall, $brushDark, 135, 190)

$g.DrawLine($penArrow, 490, 135, 590, 135)
$g.DrawString("Save Calculation Record", $fontSmall, $brushDark, 485, 118)

$g.DrawLine($penArrowLeft2, 590, 185, 490, 185)
$g.DrawString("Retrieve Past Calculations", $fontSmall, $brushDark, 480, 190)
$g.Dispose()
Save-Image $bmp "fig3_3_dfd0.png"

# --- 4. Figure 3.4: DFD Level 1 ---
$bmp = New-Object System.Drawing.Bitmap 900, 560
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$g.FillRectangle($brushServerBg, 40, 200, 130, 100)
$g.DrawRectangle($penBorder2, 40, 200, 130, 100)
$rectC = New-Object System.Drawing.RectangleF 40, 200, 130, 100
$g.DrawString("Electricity`nConsumer", $fontHead, $brushDark, $rectC, $sfCenter)

$g.FillEllipse($brushBlue, 260, 40, 140, 110)
$g.DrawEllipse($penBlue, 260, 40, 140, 110)
$rectP1 = New-Object System.Drawing.RectangleF 260, 40, 140, 110
$g.DrawString("1.0`nInput & Validate`nReadings", $fontHead, $brushDark, $rectP1, $sfCenter)

$g.FillEllipse($brushBlue, 490, 120, 140, 110)
$g.DrawEllipse($penBlue, 490, 120, 140, 110)
$rectP2 = New-Object System.Drawing.RectangleF 490, 120, 140, 110
$g.DrawString("2.0`nCompute Units &`nSlab Charges", $fontHead, $brushDark, $rectP2, $sfCenter)

$g.FillEllipse($brushBlue, 490, 310, 140, 110)
$g.DrawEllipse($penBlue, 490, 310, 140, 110)
$rectP3 = New-Object System.Drawing.RectangleF 490, 310, 140, 110
$g.DrawString("3.0`nGenerate Bill`nInvoice Summary", $fontHead, $brushDark, $rectP3, $sfCenter)

$g.FillEllipse($brushBlue, 260, 410, 140, 110)
$g.DrawEllipse($penBlue, 260, 410, 140, 110)
$rectP4 = New-Object System.Drawing.RectangleF 260, 410, 140, 110
$g.DrawString("4.0`nLocalStorage`nHistory Manager", $fontHead, $brushDark, $rectP4, $sfCenter)

# Data Stores
$g.FillRectangle($brushAmber, 710, 135, 150, 75)
$g.DrawLine($penBorder, 710, 135, 860, 135)
$g.DrawLine($penBorder, 710, 210, 860, 210)
$g.DrawLine($penBorder, 735, 135, 735, 210)
$g.DrawString("D1", $fontHead, $brushDark, 715, 160)
$g.DrawString("Tariff Rates Data`n(4 Slabs Config)", $fontText, $brushDark, 742, 150)

$g.FillRectangle($brushAmber, 710, 370, 150, 75)
$g.DrawLine($penBorder, 710, 370, 860, 370)
$g.DrawLine($penBorder, 710, 445, 860, 445)
$g.DrawLine($penBorder, 735, 370, 735, 445)
$g.DrawString("D2", $fontHead, $brushDark, 715, 395)
$g.DrawString("Calculation Records`n(LocalStorage)", $fontText, $brushDark, 742, 385)

$g.DrawLine($penArrow, 130, 200, 260, 95)
$g.DrawString("Enter meter readings", $fontSmall, $brushDark, 125, 135)

$g.DrawLine($penArrow, 400, 95, 490, 150)
$g.DrawString("Valid readings", $fontSmall, $brushDark, 410, 105)

$g.DrawLine($penArrow, 710, 175, 630, 175)
$g.DrawString("Slab rates", $fontSmall, $brushDark, 640, 155)

$g.DrawLine($penArrow, 560, 230, 560, 310)
$g.DrawString("Breakdown & totals", $fontSmall, $brushDark, 565, 260)

$g.DrawLine($penArrowLeft2, 490, 365, 170, 260)
$g.DrawString("Bill summary & printable invoice", $fontSmall, $brushDark, 250, 320)

$g.DrawLine($penArrow, 560, 420, 400, 465)
$g.DrawString("Save bill record", $fontSmall, $brushDark, 440, 435)

$g.DrawLine($penArrow, 400, 440, 710, 405)
$g.DrawString("Write history JSON", $fontSmall, $brushDark, 520, 405)

$g.DrawLine($penArrowLeft2, 260, 465, 140, 300)
$g.DrawString("Stored past records", $fontSmall, $brushDark, 140, 380)
$g.Dispose()
Save-Image $bmp "fig3_4_dfd1.png"

# --- 5. Figure 3.5: Flowchart ---
$bmp = New-Object System.Drawing.Bitmap 700, 650
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

function Draw-Pill($g, $x, $y, $w, $h, $text, $brush, $pen) {
    $g.FillEllipse($brush, $x, $y, $h, $h)
    $g.FillEllipse($brush, ($x + $w - $h), $y, $h, $h)
    $g.FillRectangle($brush, ($x + $h/2), $y, ($w - $h), $h)
    $g.DrawArc($pen, $x, $y, $h, $h, 90, 180)
    $g.DrawArc($pen, ($x + $w - $h), $y, $h, $h, 270, 180)
    $g.DrawLine($pen, ($x + $h/2), $y, ($x + $w - $h/2), $y)
    $g.DrawLine($pen, ($x + $h/2), ($y + $h), ($x + $w - $h/2), ($y + $h))
    $rect = New-Object System.Drawing.RectangleF $x, $y, $w, $h
    $g.DrawString($text, $fontHead, $brushDark, $rect, $sfCenter)
}

function Draw-Diamond($g, $x, $y, $w, $h, $text, $brush, $pen) {
    $pts = @(
        New-Object System.Drawing.Point ($x + $w/2), $y
        New-Object System.Drawing.Point ($x + $w), ($y + $h/2)
        New-Object System.Drawing.Point ($x + $w/2), ($y + $h)
        New-Object System.Drawing.Point $x, ($y + $h/2)
    )
    $g.FillPolygon($brush, $pts)
    $g.DrawPolygon($pen, $pts)
    $rect = New-Object System.Drawing.RectangleF $x, $y, $w, $h
    $g.DrawString($text, $fontText, $brushDark, $rect, $sfCenter)
}

Draw-Pill $g 260 20 180 40 "Start" $brushGreen $penGreen
$g.DrawLine($penArrow, 350, 60, 350, 90)

$g.FillRectangle($brushBlue, 220, 90, 260, 50)
$g.DrawRectangle($penBlue, 220, 90, 260, 50)
$rectF1 = New-Object System.Drawing.RectangleF 220, 90, 260, 50
$g.DrawString("Input Consumer Details &`nMeter Readings (Prev, Curr)", $fontText, $brushDark, $rectF1, $sfCenter)
$g.DrawLine($penArrow, 350, 140, 350, 170)

Draw-Diamond $g 230 170 240 70 "Are Inputs Valid &`nCurr >= Prev?" $brushAmber $penAmber

$g.DrawLine($penArrow, 470, 205, 560, 205)
$g.DrawString("No", $fontSmall, $brushDark, 480, 185)
$g.FillRectangle($brushRed, 560, 180, 120, 50)
$g.DrawRectangle($penRed, 560, 180, 120, 50)
$rectErr = New-Object System.Drawing.RectangleF 560, 180, 120, 50
$g.DrawString("Show Validation`nError Message", $fontSmall, $brushDark, $rectErr, $sfCenter)
$g.DrawLine($penArrow, 620, 180, 620, 115)
$g.DrawLine($penArrow, 620, 115, 480, 115)

$g.DrawLine($penArrow, 350, 240, 350, 275)
$g.DrawString("Yes", $fontSmall, $brushDark, 355, 248)

$g.FillRectangle($brushBlue, 210, 275, 280, 45)
$g.DrawRectangle($penBlue, 210, 275, 280, 45)
$rectU = New-Object System.Drawing.RectangleF 210, 275, 280, 45
$g.DrawString("Calculate Units Consumed:`nUnits = Current - Previous", $fontText, $brushDark, $rectU, $sfCenter)
$g.DrawLine($penArrow, 350, 320, 350, 350)

$g.FillRectangle($brushPurple, 190, 350, 320, 65)
$g.DrawRectangle($penPurple, 190, 350, 320, 65)
$rectS = New-Object System.Drawing.RectangleF 190, 350, 320, 65
$g.DrawString("Progressive Slab Rate Evaluation:`nS1 (0-100)@1.50 | S2 (101-200)@2.50`nS3 (201-300)@4.00 | S4 (>300)@6.00", $fontSmall, $brushDark, $rectS, $sfCenter)
$g.DrawLine($penArrow, 350, 415, 350, 445)

$g.FillRectangle($brushBlue, 210, 445, 280, 50)
$g.DrawRectangle($penBlue, 210, 445, 280, 50)
$rectB = New-Object System.Drawing.RectangleF 210, 445, 280, 50
$g.DrawString("Render Bill Invoice Summary,`nSlab Breakdown & Total Charges", $fontText, $brushDark, $rectB, $sfCenter)
$g.DrawLine($penArrow, 350, 495, 350, 525)

$g.FillRectangle($brushAmber, 190, 525, 320, 45)
$g.DrawRectangle($penAmber, 190, 525, 320, 45)
$rectSav = New-Object System.Drawing.RectangleF 190, 525, 320, 45
$g.DrawString("Optional: Save to LocalStorage / Print Invoice", $fontText, $brushDark, $rectSav, $sfCenter)
$g.DrawLine($penArrow, 350, 570, 350, 595)

Draw-Pill $g 260 595 180 40 "End" $brushGreen $penGreen
$g.Dispose()
Save-Image $bmp "fig3_5_workflow.png"

# --- 6. Figure 3.6: Sequence Diagram ---
$bmp = New-Object System.Drawing.Bitmap 850, 480
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$objects = @(
    @{ Name = "Consumer"; X = 100 }
    @{ Name = "Web UI (HTML/CSS)"; X = 300 }
    @{ Name = "Calc Engine (JS)"; X = 530 }
    @{ Name = "LocalStorage"; X = 740 }
)

foreach ($obj in $objects) {
    $x = $obj.X
    $g.FillRectangle($brushBlue, ($x - 65), 30, 130, 45)
    $g.DrawRectangle($penBlue, ($x - 65), 30, 130, 45)
    $rectO = New-Object System.Drawing.RectangleF ($x - 65), 30, 130, 45
    $g.DrawString($obj.Name, $fontHead, $brushDark, $rectO, $sfCenter)
    
    $penLife = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(148, 163, 184), 1)
    $penLife.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($penLife, $x, 75, $x, 440)
}

function Draw-SeqMsg($g, $x1, $x2, $y, $msg, $isReturn = $false) {
    $penM = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(30, 64, 175), 2)
    $penM.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap(5, 5)
    if ($isReturn) {
        $penM.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
        $penM.Color = [System.Drawing.Color]::FromArgb(16, 185, 129)
    }
    $g.DrawLine($penM, $x1, $y, $x2, $y)
    $midX = ($x1 + $x2) / 2
    $g.DrawString($msg, $fontSmall, $brushDark, ($midX - 110), ($y - 18))
}

Draw-SeqMsg $g 100 300 110 "1: Enter Readings & Submit"
Draw-SeqMsg $g 300 530 145 "2: validateAndCalculate(readings)"
Draw-SeqMsg $g 530 530 180 "3: calculateSlabCharges(units)"
$g.DrawArc($penBlue, 530, 170, 30, 30, 270, 180)
$g.DrawLine($penArrow, 560, 200, 532, 200)

Draw-SeqMsg $g 530 300 230 "4: Return Bill Record (Breakdown)" $true
Draw-SeqMsg $g 300 100 265 "5: Display Bill Summary & Totals" $true

Draw-SeqMsg $g 100 300 320 "6: Click 'Save to History'"
Draw-SeqMsg $g 300 530 350 "7: saveRecordToLocalStorage(rec)"
Draw-SeqMsg $g 530 740 380 "8: setItem('eb_calc_history', JSON)"
Draw-SeqMsg $g 740 300 415 "9: Success ACK & Render History Table" $true
$g.Dispose()
Save-Image $bmp "fig3_6_sequence.png"

# --- 7. Figure 3.7: Site Map ---
$bmp = New-Object System.Drawing.Bitmap 800, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$g.FillRectangle($brushBlue, 280, 25, 240, 50)
$g.DrawRectangle($penBlue, 280, 25, 240, 50)
$rectRt = New-Object System.Drawing.RectangleF 280, 25, 240, 50
$g.DrawString("PowerCalc: index.html`n(Single Page Web App)", $fontHead, $brushDark, $rectRt, $sfCenter)

$g.DrawLine($penBorder2, 400, 75, 400, 110)
$g.DrawLine($penBorder2, 90, 110, 710, 110)

$sections = @(
    @{ Name = "Hero Section"; Desc = "App Intro & CTA Button"; X = 50 }
    @{ Name = "Tariff Slabs"; Desc = "4 Slab Rate Cards"; X = 200 }
    @{ Name = "Calculator"; Desc = "Input Form & Breakdown"; X = 350 }
    @{ Name = "History"; Desc = "LocalStorage Records"; X = 500 }
    @{ Name = "About & Contact"; Desc = "Team Info & Mentorship"; X = 650 }
)

foreach ($s in $sections) {
    $x = $s.X
    $g.DrawLine($penBorder2, ($x + 50), 110, ($x + 50), 140)
    
    $g.FillRectangle($brushGreen, $x, 140, 100, 45)
    $g.DrawRectangle($penGreen, $x, 140, 100, 45)
    $rectSec = New-Object System.Drawing.RectangleF $x, 140, 100, 45
    $g.DrawString($s.Name, $fontText, $brushDark, $rectSec, $sfCenter)
    
    $g.DrawLine($penArrow, ($x + 50), 185, ($x + 50), 220)
    
    $g.FillRectangle($brushAmber, ($x - 10), 220, 120, 60)
    $g.DrawRectangle($penAmber, ($x - 10), 220, 120, 60)
    $rectDsc = New-Object System.Drawing.RectangleF ($x - 10), 220, 120, 60
    $g.DrawString($s.Desc, $fontSmall, $brushDark, $rectDsc, $sfCenter)
}

$g.FillRectangle($brushServerBg, 250, 330, 300, 40)
$g.DrawRectangle($penBorder, 250, 330, 300, 40)
$rectFtr = New-Object System.Drawing.RectangleF 250, 330, 300, 40
$g.DrawString("Footer: Copyright & Team Credits", $fontText, $brushDark, $rectFtr, $sfCenter)
$g.Dispose()
Save-Image $bmp "fig3_7_sitemap.png"

# --- 8. Figure 3.8: Wireframe ---
$bmp = New-Object System.Drawing.Bitmap 750, 580
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$g.DrawRectangle($penBorder2, 40, 20, 670, 540)
$g.FillRectangle($brushServerBg, 40, 20, 670, 35)
$g.DrawLine($penBorder2, 40, 55, 710, 55)
$g.FillEllipse($brushRed, 55, 32, 12, 12); $g.FillEllipse($brushAmber, 75, 32, 12, 12); $g.FillEllipse($brushGreen, 95, 32, 12, 12)
$g.DrawString("https://shapthagiri.github.io/electricity-bill-calculator/", $fontSmall, $brushDark, 120, 30)

$g.DrawRectangle($penBorder, 55, 65, 640, 35)
$g.DrawString("PowerCalc [EB Calculator]               Home   Tariff Slabs   Calculator   History   About", $fontSmall, $brushDark, 65, 75)

$g.FillRectangle($brushBlue, 55, 110, 640, 70)
$g.DrawRectangle($penBlue, 55, 110, 640, 70)
$rectHW = New-Object System.Drawing.RectangleF 55, 110, 640, 70
$g.DrawString("Smart Electricity Bill Calculator - Accurate Progressive Tariff Estimation`n[ Start Calculation ]    [ View Tariffs ]", $fontText, $brushDark, $rectHW, $sfCenter)

for ($k = 0; $k -lt 4; $k++) {
    $kx = 55 + ($k * 163)
    $g.DrawRectangle($penBorder, $kx, 190, 150, 55)
    $rectSl = New-Object System.Drawing.RectangleF $kx, 190, 150, 55
    $rateVal = @("1.50", "2.50", "4.00", "6.00")[$k]
    $g.DrawString("Slab $($k+1)`nRate: Rs.$rateVal", $fontSmall, $brushDark, $rectSl, $sfCenter)
}

$g.DrawRectangle($penBorder2, 55, 255, 310, 160)
$g.DrawString("Consumer & Meter Reading Form`n• Consumer Name & ID`n• Connection Type`n• Prev Reading: [ 1200 ]`n• Curr Reading: [ 1450 ]`n[ Calculate Bill ]  [ Reset ]", $fontSmall, $brushDark, 65, 265)

$g.DrawRectangle($penBorder2, 385, 255, 310, 160)
$g.DrawString("Bill Summary & Progressive Breakdown`nUnits Consumed: 250 Units`n• Slab 1 (100 u @ 1.50) = Rs.150`n• Slab 2 (100 u @ 2.50) = Rs.250`n• Slab 3 ( 50 u @ 4.00) = Rs.200`nNet Payable: Rs. 600.00`n[ Save History ]   [ Print Bill ]", $fontSmall, $brushDark, 395, 265)

$g.DrawRectangle($penBorder, 55, 425, 640, 80)
$g.DrawString("Saved Calculation History (LocalStorage)`nDate & Time | Consumer ID | Consumer Name | Units | Total Bill | Action`n2026-11-09  | EB-2026-1045| SHAPTHAGIRI G | 250   | Rs. 600.00 | [Delete]`n[ Clear All History ]", $fontSmall, $brushDark, 65, 435)

$g.FillRectangle($brushServerBg, 55, 515, 640, 30)
$g.DrawString("Footer: SRM TRP Engineering College - Department of IT - Team Shapthagiri G, Rengesh M, Sai Saran N", $fontSmall, $brushDark, 65, 522)
$g.Dispose()
Save-Image $bmp "fig3_8_wireframe.png"

# --- 9. Figure 4.1: Pseudo-code Box ---
$bmp = New-Object System.Drawing.Bitmap 800, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.DrawRectangle($penBorder, 10, 10, 780, 400)

$codeText = @"
ALGORITHM: ProgressiveElectricityBillCalculation
INPUT    : previous_reading, current_reading, customer_name, customer_id
OUTPUT   : units_consumed, slab_breakdown, total_bill_amount

1.  IF (previous_reading < 0 OR current_reading < 0) THEN
2.      DISPLAY ERROR "Meter readings must be non-negative numbers."
3.      EXIT
4.  END IF
5.  IF (current_reading < previous_reading) THEN
6.      DISPLAY ERROR "Current reading cannot be less than previous reading."
7.      EXIT
8.  END IF
9.  units_consumed = current_reading - previous_reading
10. remaining_units = units_consumed
11. total_charges   = 0.0
12. FOR each slab IN [(0, 100, 1.50), (100, 200, 2.50), (200, 300, 4.00), (300, INF, 6.00)] DO
13.     slab_capacity = slab.max - slab.min
14.     IF (remaining_units > 0) THEN
15.         billed_units = MIN(remaining_units, slab_capacity)
16.         slab_amount  = billed_units * slab.rate
17.         ADD_TO_BREAKDOWN(slab.name, billed_units, slab.rate, slab_amount)
18.         total_charges = total_charges + slab_amount
19.         remaining_units = remaining_units - billed_units
20.     ELSE
21.         ADD_TO_BREAKDOWN(slab.name, 0, slab.rate, 0.00)
22.     END IF
23. END FOR
24. DISPLAY Bill_Summary(customer_name, units_consumed, breakdown, total_charges)
25. STORE_TO_LOCALSTORAGE(bill_record)
"@
$g.DrawString($codeText, $fontCode, $brushDark, 25, 20)
$g.Dispose()
Save-Image $bmp "fig4_1_pseudocode.png"

# --- 10. Figures 4.2 to 4.8: UI Output Screenshots ---

# Figure 4.2: Home Page
$bmp = New-Object System.Drawing.Bitmap 950, 450
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.FillRectangle($brushServerBg, 0, 0, 950, 40)
$g.DrawLine($penBorder, 0, 40, 950, 40)
$g.FillEllipse($brushRed, 15, 14, 12, 12); $g.FillEllipse($brushAmber, 35, 14, 12, 12); $g.FillEllipse($brushGreen, 55, 14, 12, 12)
$g.DrawString("http://localhost:5500/index.html - Electricity Bill Calculator", $fontSmall, $brushDark, 85, 12)
$g.DrawString("PowerCalc  [EB Calculator]", $fontHead, $brushDark, 30, 55)
$g.DrawString("Home       Tariff Slabs       Calculator       History       About & Contact", $fontText, $brushDark, 460, 57)
$g.DrawLine($penBorder, 0, 85, 950, 85)

$brushHeroGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point 0, 85), (New-Object System.Drawing.Point 950, 400), [System.Drawing.Color]::FromArgb(30, 58, 138), [System.Drawing.Color]::FromArgb(59, 130, 246)
$g.FillRectangle($brushHeroGrad, 0, 85, 950, 365)
$fontHeroTitle = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
$fontHeroSub = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Regular)
$g.DrawString("ACADEMIC MINI PROJECT • DEPT OF IT", $fontSmall, $brushWhite, 360, 130)
$g.DrawString("Smart Electricity Bill Calculator", $fontHeroTitle, $brushWhite, 260, 160)
$rectSub = New-Object System.Drawing.RectangleF 100, 220, 750, 60
$g.DrawString("Calculate your electricity consumption, estimate slab-wise charges accurately,`nand manage your billing records with ease. Designed with client-side progressive tariff computation.", $fontHeroSub, $brushWhite, $rectSub, $sfCenter)

$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))), 310, 310, 160, 45)
$g.DrawString("Start Calculation ↓", $fontHead, $brushWhite, 325, 322)
$g.DrawRectangle((New-Object System.Drawing.Pen([System.Drawing.Color]::White, 1)), 490, 310, 150, 45)
$g.DrawString("View Tariff Rates", $fontHead, $brushWhite, 505, 322)
$g.Dispose()
Save-Image $bmp "fig4_2_homepage.png"

# Figure 4.3: Tariff Slabs Grid
$bmp = New-Object System.Drawing.Bitmap 950, 320
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(241, 245, 249))
$g.DrawString("TARIFF SLABS", $fontSmall, $brushDark, 430, 15)
$g.DrawString("Illustrative Progressive Slab Rates", $fontTitle, $brushDark, 310, 32)
$rates = @(
    @{ Slab = "SLAB 1"; Range = "0 – 100 Units"; Rate = "Rs. 1.50"; Note = "First 100 units consumed" }
    @{ Slab = "SLAB 2"; Range = "101 – 200 Units"; Rate = "Rs. 2.50"; Note = "Next 100 units consumed" }
    @{ Slab = "SLAB 3"; Range = "201 – 300 Units"; Rate = "Rs. 4.00"; Note = "Next 100 units consumed" }
    @{ Slab = "SLAB 4"; Range = "Above 300 Units"; Rate = "Rs. 6.00"; Note = "All remaining units over 300" }
)
for ($i = 0; $i -lt 4; $i++) {
    $x = 40 + ($i * 220)
    $g.FillRectangle($brushWhite, $x, 75, 205, 180)
    $penCard = if ($i -eq 3) { $penAmber } else { $penBorder }
    $g.DrawRectangle($penCard, $x, 75, 205, 180)
    $g.DrawString($rates[$i].Slab, $fontHead, $brushDark, ($x + 65), 90)
    $g.DrawString($rates[$i].Range, $fontText, $brushDark, ($x + 50), 120)
    $fontBigRate = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($rates[$i].Rate, $fontBigRate, $brushDark, ($x + 50), 150)
    $g.DrawString($rates[$i].Note, $fontSmall, $brushDark, ($x + 25), 200)
}
$g.DrawString("* Note: Illustrative rates for academic demonstration. Fixed meter rent and taxes excluded.", $fontSmall, $brushDark, 200, 275)
$g.Dispose()
Save-Image $bmp "fig4_3_tariffs.png"

# Figure 4.4: Calculator Input Form
$bmp = New-Object System.Drawing.Bitmap 700, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawRectangle($penBorder, 20, 20, 660, 380)
$g.DrawString("Consumer & Meter Input Form", $fontTitle, $brushDark, 40, 35)
$g.DrawLine($penBorder, 40, 65, 660, 65)

$g.DrawString("Consumer Name *", $fontHead, $brushDark, 40, 85)
$g.FillRectangle($brushServerBg, 40, 110, 280, 35); $g.DrawRectangle($penBorder, 40, 110, 280, 35)
$g.DrawString("SHAPTHAGIRI G", $fontText, $brushDark, 50, 118)

$g.DrawString("Consumer ID / Service No *", $fontHead, $brushDark, 360, 85)
$g.FillRectangle($brushServerBg, 360, 110, 280, 35); $g.DrawRectangle($penBorder, 360, 110, 280, 35)
$g.DrawString("EB-2026-814725205105", $fontText, $brushDark, 370, 118)

$g.DrawString("Connection Type", $fontHead, $brushDark, 40, 160)
$g.FillRectangle($brushServerBg, 40, 185, 280, 35); $g.DrawRectangle($penBorder, 40, 185, 280, 35)
$g.DrawString("Domestic / Residential", $fontText, $brushDark, 50, 193)

$g.DrawString("Service Address / Area", $fontHead, $brushDark, 360, 160)
$g.FillRectangle($brushServerBg, 360, 185, 280, 35); $g.DrawRectangle($penBorder, 360, 185, 280, 35)
$g.DrawString("Tiruchirappalli, Tamil Nadu", $fontText, $brushDark, 370, 193)

$g.DrawString("Previous Meter Reading (kWh) *", $fontHead, $brushDark, 40, 235)
$g.FillRectangle($brushServerBg, 40, 260, 280, 35); $g.DrawRectangle($penBorder, 40, 260, 280, 35)
$g.DrawString("1200", $fontHead, $brushDark, 50, 268)

$g.DrawString("Current Meter Reading (kWh) *", $fontHead, $brushDark, 360, 235)
$g.FillRectangle($brushServerBg, 360, 260, 280, 35); $g.DrawRectangle($penBorder, 360, 260, 280, 35)
$g.DrawString("1450", $fontHead, $brushDark, 370, 268)

$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))), 40, 325, 160, 42)
$g.DrawString("Calculate Bill", $fontHead, $brushWhite, 70, 336)
$g.FillRectangle($brushServerBg, 220, 325, 100, 42); $g.DrawRectangle($penBorder, 220, 325, 100, 42)
$g.DrawString("Reset", $fontHead, $brushDark, 245, 336)
$g.Dispose()
Save-Image $bmp "fig4_4_calculator_form.png"

# Figure 4.5: Bill Result & Slab Breakdown
$bmp = New-Object System.Drawing.Bitmap 750, 520
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawRectangle($penBorder, 20, 20, 710, 480)
$g.FillRectangle($brushServerBg, 20, 20, 710, 45)
$g.DrawString("ELECTRICITY BILL SUMMARY - INVOICE BREAKDOWN", $fontHead, $brushDark, 35, 32)
$g.FillRectangle($brushGreen, 610, 28, 100, 28)
$g.DrawString("Generated", $fontSmall, $brushDark, 630, 34)

$g.DrawString("POWER DISTRIBUTION CO. • ESTIMATED INVOICE", $fontHead, $brushDark, 190, 80)
$g.DrawString("Date: 09 Nov 2026, 09:30 PM", $fontSmall, $brushDark, 280, 105)

$g.DrawString("Consumer Name: SHAPTHAGIRI G", $fontText, $brushDark, 40, 135)
$g.DrawString("Consumer ID: EB-2026-814725205105", $fontText, $brushDark, 420, 135)
$g.DrawString("Tariff Type: Domestic / Residential", $fontText, $brushDark, 40, 160)
$g.DrawString("Address: Tiruchirappalli, Tamil Nadu", $fontText, $brushDark, 420, 160)
$g.DrawString("Previous Reading: 1,200 kWh", $fontText, $brushDark, 40, 185)
$g.DrawString("Current Reading: 1,450 kWh", $fontText, $brushDark, 420, 185)

$g.FillRectangle($brushBlue, 40, 215, 670, 35)
$g.DrawString("Total Energy Units Consumed:    250 Units", $fontHead, $brushDark, 210, 223)

$g.FillRectangle($brushServerBg, 40, 260, 670, 30)
$g.DrawRectangle($penBorder, 40, 260, 670, 30)
$g.DrawString("Slab Description                      Units Consumed    Rate (Rs.)    Slab Amount (Rs.)", $fontHead, $brushDark, 50, 268)

$slabData = @(
    "First 100 units (0 - 100)                     100            Rs. 1.50          Rs. 150.00"
    "Next 100 units (101 - 200)                    100            Rs. 2.50          Rs. 250.00"
    "Next 100 units (201 - 300)                     50            Rs. 4.00          Rs. 200.00"
    "Above 300 units                                 0            Rs. 6.00          Rs.   0.00"
)
for ($s = 0; $s -lt 4; $s++) {
    $sy = 295 + ($s * 25)
    $g.DrawLine($penBorder, 40, ($sy + 22), 710, ($sy + 22))
    $g.DrawString($slabData[$s], $fontText, $brushDark, 50, $sy)
}

$g.DrawString("Total Energy Charges: Rs. 600.00", $fontHead, $brushDark, 460, 400)
$g.DrawString("Fixed / Meter Charges: Rs. 0.00", $fontText, $brushDark, 460, 422)
$fontGrand = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Net Estimated Bill: Rs. 600.00", $fontGrand, [System.Drawing.Brushes]::Navy, 420, 445)

$g.FillRectangle($brushGreen, 40, 445, 140, 38)
$g.DrawString("Save to History", $fontHead, $brushDark, 55, 455)
$g.FillRectangle($brushBlue, 195, 445, 120, 38)
$g.DrawString("Print Bill", $fontHead, $brushDark, 225, 455)
$g.Dispose()
Save-Image $bmp "fig4_5_bill_result.png"

# Figure 4.6: History Table
$bmp = New-Object System.Drawing.Bitmap 850, 320
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawRectangle($penBorder, 20, 20, 810, 280)
$g.DrawString("Saved Calculation History (Browser LocalStorage)", $fontTitle, $brushDark, 35, 35)
$g.DrawString("3 Records Found", $fontText, $brushDark, 700, 38)
$g.DrawLine($penBorder, 20, 65, 830, 65)

$g.FillRectangle($brushServerBg, 35, 80, 780, 30)
$g.DrawRectangle($penBorder, 35, 80, 780, 30)
$g.DrawString("Date & Time         Consumer ID          Consumer Name     Readings       Units   Total Bill   Action", $fontHead, $brushDark, 45, 87)

$histRows = @(
    "09 Nov, 09:30 PM   EB-2026-105   SHAPTHAGIRI G    1200 -> 1450   250 u   Rs. 600.00   [Delete]"
    "09 Nov, 09:15 PM   EB-2026-088   RENGESH M        0500 -> 0580    80 u   Rs. 120.00   [Delete]"
    "09 Nov, 08:50 PM   EB-2026-096   SAI SARAN N      2100 -> 2550   450 u  Rs. 1,700.00  [Delete]"
)
for ($r = 0; $r -lt 3; $r++) {
    $ry = 120 + ($r * 35)
    $g.DrawLine($penBorder, 35, ($ry + 28), 815, ($ry + 28))
    $g.DrawString($histRows[$r], $fontText, $brushDark, 45, $ry)
}

$g.FillRectangle($brushRed, 35, 245, 140, 35)
$g.DrawString("Clear All History", $fontHead, $brushDark, 45, 253)
$g.Dispose()
Save-Image $bmp "fig4_6_history.png"

# Figure 4.7: Printable Bill View
$bmp = New-Object System.Drawing.Bitmap 600, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawRectangle($penBorder2, 30, 20, 540, 380)

$g.DrawString("TAMIL NADU POWER UTILITY DEMO INVOICE", $fontHead, $brushDark, 110, 35)
$g.DrawString("-------------------------------------------------------------------------------------------------", $fontText, $brushDark, 40, 55)
$g.DrawString("Date: 09/11/2026           Bill No: BILL-1731168400000", $fontSmall, $brushDark, 45, 70)
$g.DrawString("Consumer Name : SHAPTHAGIRI G", $fontText, $brushDark, 45, 95)
$g.DrawString("Service Number: EB-2026-814725205105", $fontText, $brushDark, 45, 115)
$g.DrawString("Tariff Class  : Domestic / Residential", $fontText, $brushDark, 45, 135)
$g.DrawString("Meter Readings: Previous = 1200 kWh | Current = 1450 kWh", $fontText, $brushDark, 45, 155)
$g.DrawString("Total Consumed: 250 Units", $fontHead, $brushDark, 45, 175)
$g.DrawString("-------------------------------------------------------------------------------------------------", $fontText, $brushDark, 40, 195)
$g.DrawString("Slab Breakdown:", $fontHead, $brushDark, 45, 210)
$g.DrawString("  • S1 (0-100 u)    : 100 units @ Rs. 1.50 = Rs. 150.00", $fontText, $brushDark, 45, 230)
$g.DrawString("  • S2 (101-200 u)  : 100 units @ Rs. 2.50 = Rs. 250.00", $fontText, $brushDark, 45, 250)
$g.DrawString("  • S3 (201-300 u)  :  50 units @ Rs. 4.00 = Rs. 200.00", $fontText, $brushDark, 45, 270)
$g.DrawString("  • S4 (>300 u)     :   0 units @ Rs. 6.00 = Rs.   0.00", $fontText, $brushDark, 45, 290)
$g.DrawString("-------------------------------------------------------------------------------------------------", $fontText, $brushDark, 40, 310)
$g.DrawString("NET PAYABLE AMOUNT: Rs. 600.00", $fontGrand, $brushDark, 120, 330)
$g.DrawString("Authorized Client Calculation • No Signature Required", $fontSmall, $brushDark, 140, 365)
$g.Dispose()
Save-Image $bmp "fig4_7_printable_bill.png"

# Figure 4.8: Validation Error Display
$bmp = New-Object System.Drawing.Bitmap 600, 240
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::White)
$g.DrawRectangle($penBorder, 20, 20, 560, 200)
$g.DrawString("Input Validation Error Handling", $fontHead, $brushDark, 40, 35)

$g.DrawString("Previous Meter Reading (kWh) *", $fontText, $brushDark, 40, 70)
$g.FillRectangle($brushWhite, 40, 95, 220, 35); $g.DrawRectangle($penBorder, 40, 95, 220, 35)
$g.DrawString("1500", $fontText, $brushDark, 50, 103)

$g.DrawString("Current Meter Reading (kWh) *", $fontText, $brushDark, 300, 70)
$g.FillRectangle($brushRed, 300, 95, 220, 35); $g.DrawRectangle($penRed, 300, 95, 220, 35)
$g.DrawString("1200", $fontText, $brushDark, 310, 103)

$g.DrawString("⚠ Current reading cannot be less than previous reading.", $fontSmall, [System.Drawing.Brushes]::Red, 260, 140)
$g.DrawString("The system enforces integrity check: Current Reading >= Previous Reading.", $fontSmall, $brushDark, 40, 175)
$g.Dispose()
Save-Image $bmp "fig4_8_validation_error.png"

# Figures 4.9, 4.10, 4.11: VS Code Coding Screenshots
$brushCodeText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(212, 212, 212))

# Fig 4.9: index.html
$bmp = New-Object System.Drawing.Bitmap 800, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))
$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 45, 45))), 0, 0, 800, 35)
$g.DrawString("  index.html  ×     style.css     script.js", $fontSmall, $brushCodeText, 10, 10)
$htmlSnippet = @"
1  <!DOCTYPE html>
2  <html lang="en">
3  <head>
4    <meta charset="UTF-8">
5    <title>Electricity Bill Calculator | Smart Tariff Estimator</title>
6    <link rel="stylesheet" href="style.css">
7  </head>
8  <body>
9    <header class="header">
10     <div class="logo">⚡ PowerCalc (EB Calculator)</div>
11   </header>
12   <section id="calculator">
13     <form id="ebForm">
14       <input type="text" id="consumerName" placeholder="Consumer Name" required>
15       <input type="number" id="prevReading" placeholder="Previous Reading" required>
16       <input type="number" id="currReading" placeholder="Current Reading" required>
17       <button type="submit" id="btnCalculate">Calculate Bill</button>
18     </form>
19     <div id="resultContainer"> <!-- Dynamic Progressive Breakdown Table --> </div>
20   </section>
21   <script src="script.js"></script>
22 </body>
23 </html>
"@
$g.DrawString($htmlSnippet, $fontCode, $brushCodeText, 15, 45)
$g.Dispose()
Save-Image $bmp "fig4_9_code_html.png"

# Fig 4.10: script.js
$bmp = New-Object System.Drawing.Bitmap 800, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))
$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 45, 45))), 0, 0, 800, 35)
$g.DrawString("  index.html     style.css     script.js  ×", $fontSmall, $brushCodeText, 10, 10)
$jsSnippet = @"
1  // Progressive Tariff Slabs Definition
2  const TARIFF_SLABS = [
3    { min: 0, max: 100, rate: 1.50, label: 'First 100 units' },
4    { min: 100, max: 200, rate: 2.50, label: 'Next 100 units' },
5    { min: 200, max: 300, rate: 4.00, label: 'Next 100 units' },
6    { min: 300, max: Infinity, rate: 6.00, label: 'Above 300 units' }
7  ];
8
9  function calculateSlabCharges(totalUnits) {
10   let remainingUnits = totalUnits;
11   const breakdown = [];
12   for (let slab of TARIFF_SLABS) {
13     const capacity = slab.max - slab.min;
14     if (remainingUnits > 0) {
15       const unitsInSlab = Math.min(remainingUnits, capacity);
16       breakdown.push({ label: slab.label, units: unitsInSlab, rate: slab.rate, amount: unitsInSlab * slab.rate });
17       remainingUnits -= unitsInSlab;
18     }
19   }
20   return breakdown;
21 }
"@
$g.DrawString($jsSnippet, $fontCode, $brushCodeText, 15, 45)
$g.Dispose()
Save-Image $bmp "fig4_10_code_js.png"

# Fig 4.11: style.css
$bmp = New-Object System.Drawing.Bitmap 800, 420
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))
$g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 45, 45))), 0, 0, 800, 35)
$g.DrawString("  index.html     style.css  ×     script.js", $fontSmall, $brushCodeText, 10, 10)
$cssSnippet = @"
1  /* Responsive Stylesheet for Electricity Bill Calculator */
2  :root {
3    --primary: #1e40af;
4    --accent: #f59e0b;
5    --bg-light: #f8fafc;
6  }
7  .calc-wrapper {
8    display: grid;
9    grid-template-columns: 1fr 1fr;
10   gap: 30px;
11 }
12 .tariff-grid {
13   display: grid;
14   grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
15   gap: 20px;
16 }
17 @media print {
18   body * { visibility: hidden; }
19   #printableBill, #printableBill * { visibility: visible; }
20   #printableBill { position: absolute; left: 0; top: 0; width: 100%; }
21 }
"@
$g.DrawString($cssSnippet, $fontCode, $brushCodeText, 15, 45)
$g.Dispose()
Save-Image $bmp "fig4_11_code_css.png"

Write-Output "ALL_IMAGES_GENERATED_SUCCESSFULLY"
