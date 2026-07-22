# media

`VideoSlot` 컴포넌트(`src/components/media/video-slot.tsx`)가 여기 있는 `.mp4` 파일을
찾아서 자동으로 재생합니다. 파일이 없으면 회색 플레이스홀더 박스가 대신 표시됩니다.

현재 사용 중:

- `typing-hands.mp4` — Hero 섹션 왼쪽 영상
- `walking-crowd.mp4` — Contact 섹션 영상

`.webm`이나 포스터 이미지는 코드에서 참조하지 않습니다(브라우저에 따라 없는 소스가
video 태그 전체를 에러 처리할 수 있어서 뺐어요). 필요해지면 다시 넣어달라고 하시면 됩니다.
