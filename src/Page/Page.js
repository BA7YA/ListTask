import React, { useEffect, useState } from 'react';
import { Tree} from 'antd';
import axios from 'axios';

import {DownOutlined} from '@ant-design/icons';

const Page = () => {
  const [treeData, setTreeData] = useState();


  useEffect(() => {
    axios.get('http://164.90.161.80:3000/api/content')
    .then(
      r=>{
        let data = r.data.children.map(c => { return {
          title: c.title,
          key: c.id,
          icon: <DownOutlined />
        }})
        setTreeData(data);
      },
      e=>{
        console.log(e.message);
      }
    )
  }, [])

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
  
      if (node.children) {
        return { ...node, children: updateTreeData(node.children, key, children) };
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

    axios.get(`http://164.90.161.80:3000/api/content?dirId=${key}`)
    .then(
      r=>{
        let data = r.data.children.map(c => { return {
          title: c.title,
          key: c.id,
          isLeaf: (c.title.includes('.zip')||c.title.includes('.epub')||c.title.includes('.jpg'))? true : false,
          
        }});
        setTreeData((origin) =>
          updateTreeData(origin, key, data),
        );
      },
      e=>{
        console.log(e.message);
      }
    )     
    resolve();
    });
  }

  return <Tree loadData={onLoadData} treeData={treeData} />;
};

export default Page;




