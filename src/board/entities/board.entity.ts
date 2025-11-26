export class Board {
  id: number;
  title: string;  // create시 필수
  content: string; // create시 필수
  author: string;   // create시 필수
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Board>) {
    // this(새로 만들 Board 객체)에 partial(받은 데이터)를 복사 (Object.assign = partial의 내용을 this에 복사해서 채워넣기)
    Object.assign(this, partial);
  }
}
