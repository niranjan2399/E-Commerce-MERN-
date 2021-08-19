import { Rating } from "@material-ui/lab";

export const averageRating = (product) => {
  let sum = 0;
  const length = product.ratings.length;

  product.ratings.forEach((p) => {
    sum += p.star;
  });

  const averageRating = sum / length;
  return (
    <div className="averageRating">
      <span style={{ marginTop: ".25rem" }}>
        <Rating value={averageRating} precision={0.1} readOnly={true} />
      </span>
      ({length})
    </div>
  );
};
