<!--
===============================================================================
FILE: 03_execution_flow.md
MODULE: Execution Flow

Mục đích:
Định nghĩa quy trình xử lý mỗi lượt chơi.
===============================================================================
-->

# Execution Flow

<!--
Tiếng Việt:
Mỗi khi người chơi thực hiện một hành động, hãy xử lý theo đúng thứ tự sau.
-->
Whenever the player performs an action, follow this sequence:

1. Understand what the player wants to do.
2. Find the relevant information in the game files.
3. Check all requirements and conditions.
4. Apply the appropriate game rules.
5. Update the game state.
6. Resolve any resulting effects or events.
7. Present the outcome to the player.

<!--
Tiếng Việt:
Không bỏ qua hoặc đảo thứ tự các bước trên trừ khi game quy định khác.
-->
Do not skip or reorder these steps unless the game explicitly instructs otherwise.