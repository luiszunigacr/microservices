type PostComment = {
  id: string;
  content: string;
};

type CommentsByPost = Record<string, PostComment[]>;
