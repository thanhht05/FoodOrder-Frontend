import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Product/Viewdetail";
import { useEffect, useState } from "react";
import { callFetchProductId } from "../../services/api";

const ProductPage = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); // product id
  const [productData, setProductData] = useState();
  const getImages = (raw) => {
    const images = [];
    if (raw.lstImg) {
      raw.lstImg?.map((item) => {
        images.push({
          original: `${import.meta.env.VITE_BACKEND_URL}/upload/${item.name}`,
          thumbnail: `${import.meta.env.VITE_BACKEND_URL}/upload/${item.name}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      });
    }
    return images;
  };

  useEffect(() => {
    const fetchProductById = async (id) => {
      const res = await callFetchProductId(id);
      if (res && res.data) {
        let raw = res.data;

        raw.items = getImages(raw);
        // test Skeleton
        setTimeout(() => {
          setProductData(raw);
        }, 3000);
      }
    };
    fetchProductById(id);
  }, [id]);
  return (
    <>
      <ViewDetail productData={productData} />
    </>
  );
};
export default ProductPage;
