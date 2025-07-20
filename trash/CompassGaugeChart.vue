<script setup>
import { ref, defineProps, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import VChart from 'vue-echarts';

const props = defineProps({
    windDegree: { type: Number, default: 0 },
    windSpeed: { type: Number, default: 0 },
    primaryColor: { type: String, default: '#999' },
    secondaryColor: { type: String, default: '#FFDF20' }
});

use([CanvasRenderer, GaugeChart]);

const gaugeOptions = ref({
    series: [
        {
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '110%',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 360,
            splitNumber: 12,
            itemStyle: {
                color: props.secondaryColor,
            },
            axisLine: {
                show: false,
            },
            pointer: {
                icon: 'arrow',
                length: '15%',
                offsetCenter: ['0%', '-50%'],
                width: 15,
                itemStyle: {
                    color: props.primaryColor
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: props.primaryColor,
                    width: 2
                }
            },
            splitLine: {
                length: 10,
                lineStyle: {
                    color: props.primaryColor,
                    width: 3.5
                }
            },
            axisLabel: {
                color: props.primaryColor,
                fontSize: 20,
                fontWeight: 'bold',
                distance: 12,
                overflow: 'break',
                color: '#FFDF20',
                formatter: (value) => {
                    if (value === 0) return 'N';
                    if (value === 90) return 'E';
                    if (value === 180) return 'S';
                    if (value === 270) return 'W';
                    return ''; // hide all other labels
                }
            },
            title: {
                offsetCenter: [0, '20%'],
                fontSize: 18,
            },
            detail: {
                fontSize: 30,
                offsetCenter: [0, 0],
                valueAnimation: true,
                color: props.secondaryColor,
                formatter: () => props.windSpeed,
            },
            data: [
                {
                    value: (props.windDegree - 180),
                    name: 'km/h',
                    color: '#FFDF20',
                }
            ]
        }
    ]
});

watch(
    () => [props.windDegree, props.windSpeed, props.primaryColor],
    ([newDegree, newSpeed, newPColor]) => {
        gaugeOptions.value.series[0].data[0].value = newDegree - 180;
        gaugeOptions.value.series[0].detail.formatter = () => newSpeed;

    }
);
</script>

<template>
    <VChart :option="gaugeOptions" id="chart" />
</template>

<style scoped>
::v-deep(.echarts) {
    overflow: visible !important;
}

#chart {
    width: 100%;
    height: 90%;
    margin: 0;
    padding: 0;
    overflow: visible;
    /* outline: 2px solid lime; */
}
</style>