import { CatalogView } from "@/components/index/CatalogView";
import { storageManager } from "@/storage";
import { useEffect, useState } from "react";

const IndexScreen = () => {
  const [path, setPath] = useState("");

  useEffect(() => {
    (async () => {
      const path = await storageManager.get("catalog_view_path");
      console.log(path);
      setPath(path || "/");
    })();
  }, []);

  if (!path) return null;

  return <CatalogView path={path} />;
};

export default IndexScreen;
