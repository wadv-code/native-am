import { CatalogView } from "@/components/catalog/CatalogView";
import { storageManager } from "@/storage";
import { useEffect, useState } from "react";

const CatalogScreen = () => {
  const [path, setPath] = useState("");

  useEffect(() => {
    (async () => {
      const path = await storageManager.get("catalog_view_path");
      setPath(path || "/");
    })();
  }, []);

  if (!path) return null;

  return <CatalogView path={path} />;
};

export default CatalogScreen;
