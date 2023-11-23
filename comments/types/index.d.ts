type PostComment = {
  id: string;
  content: string;
  status: "pending" | "rejected" | "appoved";
};

type CommentsByPost = Record<string, PostComment[]>;
