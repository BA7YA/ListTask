import React, { useEffect, useState } from "react";
import { Tree } from "antd";
import axios from "axios";
import CaretDownOutlined from "@ant-design/icons/CaretDownOutlined";

function Page() {
  const [treeData, setTreeData] = useState();
  const cancelTokenSource = axios.CancelToken.source();
  const { DirectoryTree } = Tree;

  useEffect(() => {
    axios.get("http://164.90.161.80:3000/api/content").then(
      (r) => {
        let data = r.data.children.map((c) => {
          return {
            title: c.title,
            key: c.id,
            isLeaf: c.hasOwnProperty("children") ? false : true,
          };
        });
        setTreeData(data);
      },
      (e) => {
        console.log(e.message);
      }
    );
  }, []);

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }

      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }

      return node;
    });
  }

  function onLoadData({ key, children }) {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      axios.get(`http://164.90.161.80:3000/api/content?dirId=${key}`, {
          cancelToken: cancelTokenSource.token,
        })
        .then(
          (r) => {
            let data = r.data.children.map((c) => {
              return {
                title: c.title,
                key: c.id,
                isLeaf: c.hasOwnProperty("children") ? false : true,
              };
            });
            setTreeData((origin) => updateTreeData(origin, key, data));
            cancelTokenSource.cancel();
            resolve();
          },
          (e) => {
            cancelTokenSource.cancel();
            console.log(e.message);
          }
        );
    });
  }
  return (
    <div style={{ maxWidth: 400 }}>
      <DirectoryTree
        selectable={false}
        switcherIcon={<CaretDownOutlined />}
        loadData={onLoadData}
        treeData={treeData}
      />
    </div>
  );
}

export default Page;
