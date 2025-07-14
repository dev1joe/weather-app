<script setup>
import { ref, defineProps, watch } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import VChart from 'vue-echarts';

const props = defineProps({
    uvIndex: { type: Number, default: 1.22 },
    primaryColor: { type: String, default: '#999' },
});

use([CanvasRenderer, GaugeChart]);

const gaugeOptions = ref({
    series: [
        {
            type: 'gauge',
            center: ['50%', '70%'],
            radius: '90%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 15,
            splitNumber: 5,
            itemStyle: {
                color: '#FFDF20'
            },
            progress: {
                show: true,
                width: 30
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    width: 30
                }
            },
            axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                    width: 2,
                    color: props.primaryColor
                }
            },
            splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                    width: 3,
                    color: props.primaryColor
                }
            },
            axisLabel: {
                distance: -20,
                color: props.primaryColor,
                fontSize: 20
            },
            anchor: {
                show: false
            },
            title: {
                show: false
            },
            detail: {
                valueAnimation: true,
                // width: '60%',
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, '-15%'],
                fontSize: 40,
                fontWeight: 'bolder',
                formatter: (val) => val.toFixed(2),
                color: 'inherit'
            },
            data: [props.uvIndex]
        },
    ]
});

watch(() => props.uvIndex, (newUV) => {
    gaugeOptions.value.series[0].data[0] = newUV;
})
</script>

<template>
    <VChart :option="gaugeOptions" />
</template>