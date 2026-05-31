---
title: "你好，世界"
description: "这是我的第一篇文章，欢迎来到数字花园"
date: 2025-01-01
tags: ["随笔", "开篇"]
---

欢迎来到我的数字花园 🌱

这里是记录知识、思考和日常的地方。我会在这里分享技术文章、学习笔记和生活感悟。

## 关于这个站点

这个网站使用 [Astro](https://astro.build) 构建，托管在 GitHub Pages 上。

### 特色功能

- **代码高亮** — 支持 Python、MATLAB 等多种语言
- **数学公式** — 使用 KaTeX 渲染 LaTeX 公式
- **短动态** — 随时记录灵感和日常

## 代码示例

### Python

```python
import numpy as np
from typing import List


def fibonacci(n: int) -> List[int]:
    """生成斐波那契数列的前 n 项"""
    if n <= 0:
        return []
    if n == 1:
        return [0]

    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i - 1] + fib[i - 2])
    return fib


print(fibonacci(10))
# 输出: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### MATLAB

```matlab
% 绘制正弦波
x = linspace(0, 2*pi, 100);
y = sin(x);

figure;
plot(x, y, 'LineWidth', 2);
title('正弦函数');
xlabel('x');
ylabel('sin(x)');
grid on;
```

## 数学公式

行内公式示例：$E = mc^2$

块级公式示例：

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u
$$

## 下一步

在接下来的文章中，我会分享更多技术内容和个人思考。敬请期待！
