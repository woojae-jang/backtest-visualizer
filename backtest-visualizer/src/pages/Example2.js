import React from "react";
import WeightsInputTable3 from "components/WeightsInputTable3";
import { assetCodeList } from "utils/data";

class Example2 extends React.Component {
  render() {
    const columns = [
      {
        title: "name",
        dataIndex: "name"
      }
    ];

    assetCodeList.forEach(name => {
      columns.push({ title: name, dataIndex: name, editable: true });
    });

    const dataSource = {
      dataSource: [
        {
          key: "0",
          name: `Port #0`,
          "069500": 100,
          "232080": 0,
          "143850": 0,
          "195930": 0,
          "238720": 0,
          "192090": 0,
          "148070": 0,
          "136340": 0,
          "182490": 0,
          "132030": 0,
          "130680": 0,
          "114800": 0,
          "138230": 0,
          "139660": 0,
          "130730": 0
        }
      ],
      count: 1
    };

    return <WeightsInputTable3 columns={columns} dataSource={dataSource} />;
  }
}
export default Example2;
