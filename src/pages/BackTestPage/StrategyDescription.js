import { Tabs } from "antd";
import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const TabPane = Tabs.TabPane;

class StrategyDescription extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey="1" small="small">
        <TabPane tab="Momentum" key="1">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: 사용안함</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br /> 리밸런싱 날, 모멘텀 점수가 가장 높은 자산의 비중을 100
        </TabPane>
        <TabPane tab="Momentum2" key="2">
          <Title level={4}>Arg1: top</Title>
          <Title level={4}>Arg2: momentumWindow</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br /> 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩
          (동일비중)
        </TabPane>
        <TabPane tab="Momentum3" key="3">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: 사용안함</Title>
          <Title level={4}>Asset: 채권</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          리밸런싱 날, 절대모멘텀 수치로 각 주가지수가 상승장인지 판단
          <br />
          각각의 주가지수가 상승장일 경우, 비중 16씩, 남은 비중은 채권
        </TabPane>
        <TabPane tab="Momentum4" key="4">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: 사용안함</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          리밸런싱 날, 주식지수 6개의 모멘텀 점수 랭크를 메긴 다음, 순위별로
          차등 비중
        </TabPane>
        <TabPane tab="Momentum5" key="5">
          <Title level={4}>Arg1: top</Title>
          <Title level={4}>Arg2: 사용안함</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 1,3,6개월 평균수익률
          <br />
          리밸런싱 날, 주식지수 6개중 모멘텀 점수가 높은 top개 지수를 100/top 씩
          (동일비중)
        </TabPane>
        <TabPane tab="Momentum6" key="6">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: absScore</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          absScore: 절대모멘텀 필터 점수
          <br />
          리밸런싱 날, 우선적으로 절대모멘텀 점수로 필터링, 필터링된 주가지수
          n개, n 의 크기에 따라 주식:채권,달러 비중 결정 (채권은 하이일드)
        </TabPane>
        <TabPane tab="Momentum7" key="7">
          <Title level={4}>Arg1: top</Title>
          <Title level={4}>Arg2: momentumWindow</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          리밸런싱 날, 모멘텀 점수가 높은 top개 지수를 100/top 씩 (동일비중)
          <br />
        </TabPane>
        <TabPane tab="Momentum8" key="8">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: 사용안함</Title>
          <Title level={4}>Asset: selectedAsset</Title>
          절대모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          상승장일경우, 주식(selectedAsset) 100
          <br />
          하락장일경우, 현금 100
        </TabPane>
        <TabPane tab="Momentum9" key="9">
          <Title level={4}>Arg1: momentumWindow</Title>
          <Title level={4}>Arg2: top</Title>
          <Title level={4}>Asset: 사용안함</Title>
          절대모멘텀 점수 : 최근 세계주가지수 momentumWindow 거래일 수익률
          <br />
          상승장일경우, 주식 60
          <br />
          하락장일경우, 주식 20
          <br />
          주가지수 상대모멘텀 상위 top개 매수
          <br />
        </TabPane>
        <TabPane tab="Momentum10" key="10">
          <Title level={4}>Arg1: top</Title>
          <Title level={4}>Arg2: momentumWindow</Title>
          <Title level={4}>Asset: 사용안함</Title>
          모멘텀 점수 : 최근 momentumWindow 거래일 수익률
          <br />
          상대모멘텀으로 정렬후 절대모멘텀 충족시 매수
          <br />
          상위 top개
        </TabPane>
      </Tabs>
    );
  }
}

export default StrategyDescription;
