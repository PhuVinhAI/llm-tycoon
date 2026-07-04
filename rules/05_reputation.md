<!--
===============================================================================
FILE: 05_reputation.md
MODULE: Rules / Reputation

Mục đích:
Định nghĩa nguồn tăng/giảm REP và vai trò mở khóa của REP.

Tác dụng:
REP là trục tiến bộ xã hội của game: quyết định hợp đồng nào xuất hiện,
ứng viên nào chịu về làm, nhà đầu tư nào để mắt tới.

Trách nhiệm:
- Định nghĩa thang REP và các nguồn thay đổi.
- Định nghĩa nguyên tắc mở khóa theo ngưỡng REP.
===============================================================================
-->

# Reputation

## Scale

REP ranges from 0 to 50 (floor 0, cap 50).

## Sources

| Source | REP change |
|---|---|
| Model reception: Breakthrough / Great / Good / Mediocre / Failure | +8 / +5 / +3 / +1 / −2 |
| Open-source release | reception REP × 2 (replaces the normal reception REP) |
| Contract completed / cancelled | +1 / −2 |
| Project cancelled | −1 |
| Competition won | per the competition (Content) |
| Event-granted | per the event (Content) |

## Thresholds

- Contracts, Employee candidates, and the angel investor unlock at REP thresholds defined in the Content.
- The engine announces a threshold unlock in the Events step of the first month the condition holds.
- Unlocks never revert: once announced, an offer stays available even if REP later drops.

<!--
Tiếng Việt (tóm tắt):
REP từ 0 đến 50 (sàn 0, trần 50).

Nguồn: tiếp nhận Model (Đột phá/Tuyệt/Tốt/Tàm tạm/Thất bại = +8/+5/+3/+1/−2);
phát hành mã nguồn mở = REP tiếp nhận ×2 (thay thế mức thường); hoàn thành
hợp đồng +1, hủy hợp đồng −2; hủy dự án −1; thắng cuộc thi và sự kiện theo
Content.

Ngưỡng: hợp đồng, ứng viên và nhà đầu tư thiên thần mở theo ngưỡng REP trong
Content; engine thông báo ở bước Sự kiện của tháng đầu tiên đạt ngưỡng; đã
mở thì không đóng lại dù REP tụt.
-->
