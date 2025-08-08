// JavaScript for Bootstrap-only Sales Dashboard
(function() {
    'use strict';

    // Sample data for charts
    const salesTrendData = {
        '7D': {
            labels: ['Jan 8', 'Jan 9', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13', 'Jan 14'],
            data: [12500, 15200, 18300, 14800, 22100, 19500, 25300]
        },
        '30D': {
            labels: ['Dec 15', 'Dec 20', 'Dec 25', 'Dec 30', 'Jan 5', 'Jan 10', 'Jan 14'],
            data: [285000, 320000, 298000, 445000, 398000, 425000, 487000]
        },
        '90D': {
            labels: ['Oct', 'Nov', 'Dec', 'Jan'],
            data: [1250000, 1450000, 1680000, 1950000]
        }
    };

    const categoryData = {
        labels: ['Electronics', 'Fashion', 'Home & Kitchen', 'Office', 'Sports'],
        data: [145250, 89350, 52400, 38750, 24800],
        colors: ['#0d6efd', '#6c757d', '#28a745', '#ffc107', '#dc3545']
    };

    let charts = {};

    // Initialize dashboard
    function init() {
        createSalesTrendChart('30D');
        createCategoryChart();
        animateCounters();
    }

    // Create sales trend chart
    function createSalesTrendChart(period) {
        const ctx = document.getElementById('salesTrendChart');
        if (!ctx) return;

        const data = salesTrendData[period];
        
        if (charts.salesTrend) {
            charts.salesTrend.destroy();
        }

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
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Create category chart
    function createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

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
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    // Animate counters
    function animateCounters() {
        const counters = [
            { element: document.querySelector('.card-body h4'), target: 284562.45, prefix: '$', suffix: '' },
            { element: document.querySelectorAll('.card-body h4')[1], target: 1247, prefix: '', suffix: '' },
            { element: document.querySelectorAll('.card-body h4')[2], target: 856, prefix: '', suffix: '' }
        ];

        counters.forEach(counter => {
            if (!counter.element) return;
            
            let current = 0;
            const increment = counter.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    current = counter.target;
                    clearInterval(timer);
                }
                
                let displayValue;
                if (counter.prefix === '$') {
                    displayValue = counter.prefix + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else {
                    displayValue = Math.floor(current).toLocaleString();
                }
                
                counter.element.textContent = displayValue + counter.suffix;
            }, 20);
        });
    }

    // Global functions for HTML onclick handlers
    window.changePeriod = function(period, button) {
        // Update active button
        document.querySelectorAll('[onclick*="changePeriod"]').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Update chart
        createSalesTrendChart(period);
    };

    window.refreshData = function() {
        // Simulate refresh animation
        const refreshIcon = document.querySelector('.fa-sync-alt');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
            setTimeout(() => {
                refreshIcon.style.animation = '';
                // Re-animate counters
                animateCounters();
            }, 1000);
        }
    };

    window.exportData = function() {
        // Create CSV export
        const csvContent = [
            'Sales Dashboard Export',
            'Export Date: ' + new Date().toLocaleDateString(),
            '',
            'Metrics,Value',
            'Total Revenue,$284562.45',
            'Total Orders,1247',
            'Unique Customers,856',
            'Growth Rate,+18.5%',
            '',
            'Top Products,Sales',
            'iPhone 15 Pro,$87550',
            'MacBook Air M2,$74322',
            'Samsung TV 55",$56880',
            'Wireless Headphones,$39585',
            'Gaming Chair,$26125'
        ].join('\n');

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

    // Add spin animation for refresh
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);

})();
