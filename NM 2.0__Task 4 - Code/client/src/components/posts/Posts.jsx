import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({userId}) => {
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/posts?userId="+userId).then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error && <p>Something went wrong!</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        data && data.map((post) => <Post post={post} key={post.id} />)
      )}
    </div>
  );
  
};

export default Posts;
