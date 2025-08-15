// JavaScript for Bootstrap-only Sales Dashboard (Enhanced)
(function () {
    'use strict';

    const salesTrendData = {
        '7D': { labels: ['Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14'], data: [] },
        '30D': { labels: ['Dec 15', 'Dec 20', 'Dec 25', 'Dec 30', 'Jan 5', 'Jan 10', 'Jan 14'], data: [] },
        '90D': { labels: ['Oct', 'Nov', 'Dec', 'Jan'], data: [] }
    };

    const categoryData = {
        labels: ['Electronics', 'Fashion', 'Home & Kitchen', 'Office', 'Sports'],
        data: [],
        colors: ['#0d6efd', '#6c757d', '#28a745', '#ffc107', '#dc3545']
    };

    let charts = {};

    // Generate random data
    function generateRandomData() {
        salesTrendData['7D'].data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 30000) + 10000);
        salesTrendData['30D'].data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 500000) + 200000);
        salesTrendData['90D'].data = Array.from({ length: 4 }, () => Math.floor(Math.random() * 2000000) + 1000000);
        categoryData.data = Array.from({ length: 5 }, () => Math.floor(Math.random() * 150000) + 20000);
    }

    // Initialize dashboard
    function init() {
        generateRandomData();
        createSalesTrendChart('30D');
        createCategoryChart();
        animateCounters();
    }

    function createSalesTrendChart(period) {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;
        const data = salesTrendData[period];

        if (charts.salesTrend) charts.salesTrend.destroy();

        charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: data.data,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#0d6efd',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => '$' + value.toLocaleString() }
                    }
                },
                interaction: { intersect: false, mode: 'index' }
            }
        });
    }

    function createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (charts.category) charts.category.destroy();

        charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.data,
                    backgroundColor: categoryData.colors,
                    borderWidth: 3,
                    borderColor: '#1a1a1a'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, font: { size: 12 } } }
                },
                cutout: '60%'
            }
        });
    }

    function animateCounters() {
        const counters = [
            { element: document.querySelector('.card-body h4'), target: salesTrendData['30D'].data.reduce((a, b) => a + b, 0), prefix: '$' },
            { element: document.querySelectorAll('.card-body h4')[1], target: Math.floor(Math.random() * 2000) + 500, prefix: '' },
            { element: document.querySelectorAll('.card-body h4')[2], target: Math.floor(Math.random() * 1500) + 300, prefix: '' }
        ];

        counters.forEach(counter => {
            if (!counter.element) return;
            let current = 0;
            const increment = counter.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) { current = counter.target; clearInterval(timer); }
                counter.element.textContent = counter.prefix === '$'
                    ? counter.prefix + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : Math.floor(current).toLocaleString();
            }, 20);
        });
    }

    window.changePeriod = function (period, button) {
        document.querySelectorAll('[onclick*="changePeriod"]').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        createSalesTrendChart(period);
    };

    window.refreshData = function () {
        const refreshIcon = document.querySelector('.fa-sync-alt');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
            setTimeout(() => {
                refreshIcon.style.animation = '';
                generateRandomData();
                createSalesTrendChart('30D');
                createCategoryChart();
                animateCounters();
            }, 1000);
        }
    };

    window.exportData = function () {
        const csvContent = [
            'Sales Dashboard Export',
            'Export Date: ' + new Date().toLocaleDateString(),
            '',
            'Metrics,Value',
            'Total Revenue,$' + salesTrendData['30D'].data.reduce((a, b) => a + b, 0).toLocaleString(),
            'Total Orders,' + (Math.floor(Math.random() * 2000) + 500),
            'Unique Customers,' + (Math.floor(Math.random() * 1500) + 300),
            '',
            'Categories,Sales'
        ].concat(categoryData.labels.map((label, i) => `${label},$${categoryData.data[i].toLocaleString()}`))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales-dashboard-' + new Date().toISOString().split('T')[0] + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const style = document.createElement('style');
    style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', init);

})();
