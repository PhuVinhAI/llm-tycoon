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

# Fame (Danh tiếng)

## Scale

Fame ranges from 0 to 5000 (floor 0, cap 5000).

## Sources

| Source | Fame change |
|---|---|
| Model reception: Breakthrough / Great / Good / Mediocre / Failure | +800 / +500 / +300 / +100 / −100 |
| Open-source release | reception Fame × 2 (replaces the normal reception Fame) |
| Contract completed / cancelled | +100 / −200 |
| Project cancelled | −100 |
| Competition won | per the competition (Content) |
| Event-granted | per the event (Content) |

## Thresholds

- Contracts, Employee candidates, and the angel investor unlock at Fame thresholds defined in the Content.
- The engine announces a threshold unlock in the Events step of the first month the condition holds.
- Unlocks never revert: once announced, an offer stays available even if Fame later drops.

<!--
Tiếng Việt (tóm tắt):
Fame từ 0 đến 5000 (sàn 0, trần 5000).

Nguồn: tiếp nhận Model (Đột phá/Tuyệt/Tốt/Tàm tạm/Thất bại = +800/+500/+300/+100/−100);
phát hành mã nguồn mở = Fame tiếp nhận ×2 (thay thế mức thường); hoàn thành
hợp đồng +100, hủy hợp đồng −200; hủy dự án −100; thắng cuộc thi và sự kiện theo
Content.

Ngưỡng: hợp đồng, ứng viên và nhà đầu tư thiên thần mở theo ngưỡng Fame trong
Content; engine thông báo ở bước Sự kiện của tháng đầu tiên đạt ngưỡng; đã
mở thì không đóng lại dù Fame tụt.
-->
