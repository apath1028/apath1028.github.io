---
title: 小土堆Pytorch
date: 2026-04-16 21:28:10
category: 学习
tags: [deeplearing, learning]
---

管理环境

查看环境列表：conda env list

激活环境：conda activate (pytorch)

pip list 列出列表



#### P4 Python学习中的两大法宝函数（当然也可以用在PyTorch）
dir()：打开工具箱，看见里面有什么东西

help()：说明书

dir(pytorch) -> 输出1、2、3、4

dir(pytorch.3) -> 输出：a, b, c

help(pytorch.3.a) -> 输出：将此扳手放在特定地方，然后拧动

有双下划线 -> 不可篡改，最底层



#### P5 PyCharm及Jupyter使用及对比
进入Jupyter：进入终端、激活pytorch环境、输入jupyter notebook

**代码是以块为一个整体运行的话：**

python文件的块是所有行的代码；

→优：通用，传播方便，适用于大型项目

→缺：需要从头运行

python控制台是以每一行为块/任意行，运行的；

→优：显示每个变量属性

→缺：不利于代码阅读及修改

Jupyter是以任意行为块运行的

→优：以任意行为块运行，利用代码的阅读及修改

→缺：环境需要配置



#### P6 PyTorch加载数据初认识
如何加载数据

Dataset：数据集

Dataloader：数据装载器

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776184156080-fdc4395e-5842-4e92-bb99-3834328dcc0a.png)

```python
from torch.utils.data from Dataset
```

Dataset：抽象类，所有的数据集都需要去继承这个类，所有的子类都应该重写“__getitem__”，以获取每一个数据集及对应的label，还可以选择去重写长度类“__len__”获取数据的长度



#### P7 Dataset类代码实战
```python
from torch.utils.data import Dataset
from PIL import Image
import os # 系统库


class MyData(Dataset):

    def __init__(self, root_dir, label_dir):
        self.root_dir = root_dir  # 全局变量
        self.label_dir = label_dir
        self.path = os.path.join(self.root_dir, self.label_dir)  # 获得图片的路径地址
        self.img_path = os.listdir(self.path)  # 所有图片地址的列表

    def __getitem__(self, idx):  # 获取其中的图片
        img_name = self.img_path[idx]  # 用self代表全局的
        img_item_path = os.path.join(self.root_dir, self.label_dir, img_name)  # 图片的相对路径
        img = Image.open(img_item_path) # 读取图片
        label = self.label_dir
        return img, label

    def __len__(self):  # 这个数据到底有多长
        return len(self.img_path)


root_dir = 'xiaotudui/dataset/train'
ants_label_dir = 'ants'
bees_label_dir = 'bees'
ants_dataset = MyData(root_dir, ants_label_dir)
bees_dataset = MyData(root_dir, bees_label_dir)

train_dataset = ants_dataset + bees_dataset  # 拼接数据集
```

初始化类：根据这一个类去创建一个特例/实例的时候，它就要运行的一个函数，是为整个class提供全局变量



#### P8 TensorBoard的使用（一）
```python
from torch.utils.tensorboard import SummaryWriter
from PIL import Image
import numpy as np

writer = SummaryWriter('logs') # 传入文件夹的名称，剩余参数不常用
image_path = r'D:\0000\project\deeplearning\Project1\xiaotudui\dataset\train\ants\0013035.jpg'
img_PIL=Image.open(image_path)
img_array = np.array(img_PIL)

writer.add_image("test", img_array, 1, dataformats='HWC')

# y = 2x
for i in range(100):
    writer.add_scalar("y=2x", 2*i, i)  # 添加标量数据到summary 标题，y轴，x轴


writer.close()
```

writer.add_image()：添加image

writer.add_scalar()：添加一个标量数据到summary中

tag, scalar_value, global_step=None, walltime=None

tag：图表的title

scalar_value：y轴，需要去保存的数值

global_step：x轴，训练到多少步的时候对应的数值👆是多少

scalar标量，数量

打开生成的事件文件：**tensorboard --logdir=事件文件所在文件名 --port=6007(可选)**

****

#### **P9 TensorBoard的使用（二）add_image()的使用（常用来观察训练效果）**
writer.add_image()：添加image，**显示图片**

tag, img_tensor, global_step=None, walltime=None, dataformats='CHW'

tag：图表的title

img_tensor：图像，需要的数据类型是：torch.Tensor, numpy.array, string/blobname

global_step：x轴

**数据的尺寸：默认（3，H，W），如果使用（H，W，3）需要改dataformats='HWC'**

Image.open -> JpegImage类型

numpy.array：用opencv读取/numpy

img_array = np.array(img)

cv.img = cv2.imread(img_path)



#### P10 Transforms的使用（一）
Transforms：对图像进行一些变换

```python
from PIL import Image
from torch.utils.tensorboard import SummaryWriter
from torchvision import transforms


# python的用法 -> tensor数据类型
# 通过 transforms.ToTensors去看两个问题

# 2、为什么我们需要Tensor数据类型

img_path = r'D:\0000\project\deeplearning\Project1\xiaotudui\dataset\train\ants\0013035.jpg'
img = Image.open(img_path)

writer = SummaryWriter("logs")

# 1、transforms该如何使用（python）
tensor_trans = transforms.ToTensor() # 取出工具
tensor_img = tensor_trans(img)

writer.add_image("Tensor_img", tensor_img)

writer.close()

print(tensor_img)
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776270096720-35e4923c-6deb-459b-9e1e-dda2c798daa9.png)

transforms.py工具箱（图片经过工具输出想要的结果）

Compose：结合不同的transforms together

**ToTensor：把一个PIL or numpy 数据类型的图片转化成tensor，传入pic**

Resize：对图片进行尺寸变换

————>创建具体的工具transforms.ToTensor()

使用工具：输入输出，result=tool(input)



#### P11 Transforms的使用（二）
为什么我们需要Tensor数据类型？包装了一些反向神经网络所需要的一些理论基础的参数

里面有 backward_hooks(反向传播)、grad(梯度)、requires_grad等



#### P12 常见的Transforms（一）
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776270607122-ae4dc19d-6511-4ff1-a422-223678d566c5.png)

```python
from PIL import Image
from torch.utils.tensorboard import SummaryWriter
from torchvision import transforms

writer = SummaryWriter("logs")
img = Image.open(r"D:\0000\project\deeplearning\Project1\xiaotudui\dataset\train\ants\0013035.jpg")
print(img)

# ToTENSOR
trans_totensor = transforms.ToTensor()
img_tensor = trans_totensor(img)
writer.add_image("ToTensor", img_tensor)

# Normalize
print(img_tensor[0][0][0])
trans_norm = transforms.Normalize([6, 3, 2], [9, 3, 5])
img_norm = trans_norm(img_tensor)
print(img_norm[0][0][0])
writer.add_image("Normlize", img_norm, 2)

# Resize
print(img.size)
trans_resize = transforms.Resize((512, 512))
# img PIL -> resize -> img_resize PIL
img_resize = trans_resize(img)
# img_resize PIL -> totensor -> img_resize tensor
img_resize = trans_totensor(img_resize)
writer.add_image("Resize", img_resize, 0)
print(img_resize)

# compose - resize - 2
trans_resize_2 = transforms.Resize(512)
# PIL -> PIL -> tensor
trans_compose = transforms.Compose([trans_resize_2, trans_totensor])  # 类型要匹配  打包
img_resize_2 = trans_compose(img)
writer.add_image("Resize", img_resize_2, 1)

# RandomCrop
trans_random = transforms.RandomCrop((512,600))
trans_compose_2 = transforms.Compose([trans_random, trans_totensor])
for i in range(10):
    img_crop = trans_compose_2(img)
    writer.add_image("RandomCropHW", img_crop, i)


writer.close()

```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776270826756-4e7b4f3b-6b49-48e1-9ab9-d266f7547483.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776270837810-a1be5238-3d7b-4fc6-a421-0c8f264eeae2.png)

__call__：可以不用哪个点hello，直接使用括号进行调用

Normalize归一化：传入均值和标准差（每个通道）对Tensor数据类型进行归一化（每个通道）

<font style="color:#bcbec4;background-color:#1e1f22;">output[channel] = (input[channel] - mean[channel]) / std[channel]</font>

输入值 - 均值 / 标准差

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776271471633-294800e6-18c2-4e8a-88eb-4581a28a84ee.png)

图片色调改变



#### P13 常见的Transforms（二）
Resize()的使用：

输入PIL Image，给定尺寸是（H, W）如果只给一个数，对最小的边进行等比缩放（不会变形）

img PIL -> resize -> img_resize PIL -> totensor -> img_resize tensor

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776322923492-3d880488-3b0b-4947-bc55-91779c446ef7.png)



RandomCrop随机裁剪：

输入同Resize，不会缩放只裁剪，单个值是正方形？

****

**总结：**

关注输入和输出类型

多看官方文档

关注方法需要什么参数

不知道返回值的时候：print   print(type())   debug



#### P14 torchvision中的数据集使用
[torchvision](https://docs.pytorch.org/docs/1.8.1/index.html)

COCO：目标检测，语义分割

MNIST：入门数据集，手写文字

CIAFR：物体识别



io模块：不常用

models：提供常见的神经网络，已经预训练好了（分类、语义分割、目标检测、视频分类）

ops：少见特殊的操作，用不到

```python
import torchvision
from torch.utils.tensorboard import SummaryWriter

dataset_transforms = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor()
])

trans_set = torchvision.datasets.CIFAR10(root='./data', train=True, transform=dataset_transforms, download=True)
test_set = torchvision.datasets.CIFAR10(root='./data', train=False, transform=dataset_transforms, download=True)

# print(test_set[0])
# print(test_set.classes)
#
# img, target = trans_set[0]
# print(img)
# print(target)
# print(test_set.classes[target])
# img.show()
#
# print(test_set[0])

# 显示
writer = SummaryWriter('p10')
for i in range(10):
    img, label = trans_set[i]
    writer.add_image('test_set', img, i)

writer.close()
```

**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">torchvision.datasets.CIFAR10</font>****<font style="color:rgb(38, 38, 38);">(</font>**_**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">root:</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Union</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">[</font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">str</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">,</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Path</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">]</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">train:</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">bool</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">=</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">True</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">transform:</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Optional</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">[</font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Callable</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">]</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">=</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">target_transform:</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Optional</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">[</font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Callable</font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">]</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">=</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">download:</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">bool</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">=</font>**__**<font style="color:rgb(38, 38, 38);"> </font>**__**<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">False</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

<font style="color:rgb(38, 38, 38);">root：数据集放在上面位置</font>

<font style="color:rgb(38, 38, 38);">train：为True时是训练集，反之为测试集</font>

<font style="color:rgb(38, 38, 38);">transform：对数据集进行什么样的变化</font>

<font style="color:rgb(38, 38, 38);">target_transform：对target进行transform</font>

<font style="color:rgb(38, 38, 38);">download：是否从网上下载数据集</font>



#### P15 Dataloader的使用
把数据加载到神经网络中，从dataset中取数据（取多少、怎么取，用参数进行设置）

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.utils.data.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">DataLoader</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:#DF2A3F;">dataset</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  自定义的数据集</font>**

_**<font style="color:#DF2A3F;">batch_size=1</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  抓牌抓几张</font>**

_**<font style="color:#DF2A3F;">shuffle=False</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">, 打乱的意思， 洗牌（第二次是否和第一次是否一样，喜欢设置成True）</font>**

_**<font style="color:#DF2A3F;">sampler=None</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  后面讲解 默认随即抓取？</font>**

_**<font style="color:#DF2A3F;">batch_sampler=None</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">, </font>**

_**<font style="color:#DF2A3F;">num_workers=0</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  单进程/多进程（速度快）</font>**

_**<font style="color:#D8DAD9;">collate_fn=None</font>**_**<font style="color:#D8DAD9;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#D8DAD9;">pin_memory=False</font>**_**<font style="color:#D8DAD9;background-color:rgb(243, 244, 247);">, </font>**

_**<font style="color:#DF2A3F;">drop_last=False</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  100张牌取三张牌最后余1张是否舍去</font>**

_**<font style="color:#E7E9E8;">timeout=0</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">worker_init_fn=None</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">multiprocessing_context=None</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">generator=None</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">*</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">prefetch_factor=2</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">persistent_workers=False</font>**_**<font style="color:#E7E9E8;">)</font>**



随机抓取

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776325525982-7e2d6460-7986-4a38-85d1-15724c72a37e.png)

```python
import torchvision
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

# 准备的测试数据集
test_data = torchvision.datasets.CIFAR10("./data", train=False, transform=torchvision.transforms.ToTensor())

test_loader = DataLoader(dataset=test_data, batch_size=64, shuffle=True, num_workers=0, drop_last=True)

# 测试数据集中第一张图片及target
img, target = test_data[0]
print(img.shape)
print(target)

writer = SummaryWriter("dataloader")
for epoch in range(2): # 进行两轮读取
    step = 0
    for data in test_loader:
        imgs, targets = data
        # print(imgs.shape)
        # print(targets)
        writer.add_images("Epoch: {}".format(epoch), imgs, step)
        step += 1

writer.close()
```



#### P16 神经网络的基本骨架——nn.Module的使用
[torch.nn](https://docs.pytorch.org/docs/1.8.1/nn.html)

containers：容器/骨架、结构

module: input -> forward -> output：最常用，给所有神经网络提供基本骨架

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776326283685-22b15981-277d-491f-b1cf-107b5ff50c32.png)

```python
import torch.nn as nn
import torch.nn.functional as F

class Model(nn.Module): # 继承model这个类/模板，然后写自己的东西
    def __init__(self): # 初始化
        super(Model, self).__init__() # 对父类调用初始化函数
        self.conv1 = nn.Conv2d(1, 20, 5)
        self.conv2 = nn.Conv2d(20, 20, 5)

    def forward(self, x): # 向前，前向传播，输入是x 先卷积非线性处理，在卷积再非线性处理
        x = F.relu(self.conv1(x))
        return F.relu(self.conv2(x))
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776326402395-7df4a2f9-6823-4f41-a1f1-b26beb0fae8a.png)

+ **<font style="color:rgb(238, 76, 44);">Convolution Layers 卷积层</font>**
+ **<font style="color:rgb(238, 76, 44);">Pooling layers 池化层</font>**
+ **<font style="color:rgb(238, 76, 44);">Padding Layers</font>**
+ **<font style="color:rgb(238, 76, 44);">Non-linear Activations (weighted sum, nonlinearity) 非线性激活</font>**
+ **<font style="color:rgb(238, 76, 44);">Normalization Layers 正则化层</font>**

```python
import torch
from torch import nn


class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()

    def forward(self, input):
        output = input + 1
        return output


tudui = Tudui()
x = torch.tensor(1.0)
output = tudui(x)
print(output)
```



#### P17 土堆说卷积操作（可选看）
torch.nn是torch.nn.functional的封装，方便使用

卷积层convolution

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.functional.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">conv2d</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:rgb(38, 38, 38);">input</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,   输入 </font>****<font style="color:rgb(38, 38, 38);"> shape(minibatch,in_channels,iH,iW)</font>**

_**<font style="color:rgb(38, 38, 38);">weight</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,   权重（卷积核）</font>****<font style="color:rgb(38, 38, 38);"> shape(</font>****<font style="color:#DF2A3F;">out_channels</font>****<font style="color:rgb(38, 38, 38);">,in_channels / groups,kH,kW) groups一般取1</font>**

_**<font style="color:rgb(38, 38, 38);">bias=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  偏置</font>**

_**<font style="color:rgb(38, 38, 38);">stride=1</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  步进（横向纵向走几步）单个数/元组（sW, sH）</font>**

_**<font style="color:rgb(38, 38, 38);">padding=0</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  输入图像的左右两边进行填充多大 -> 数字/元组</font>**

_**<font style="color:rgb(38, 38, 38);">dilation=1</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">groups=1</font>**_**<font style="color:rgb(38, 38, 38);">)</font>****<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);"> → Tensor</font>**

conv2d: (2代表是二维)

输入，权重（卷积核），偏置，步进（横向纵向），输入图像的左右两边进行填充 ，

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776327706240-90a426df-ef44-4c56-affe-d968affebe63.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776327854051-cb46d1eb-eac0-4ba0-9ab9-89464356e97f.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776327935317-4df60e3e-9cd7-433e-99a9-bb4581dd8ad4.png)

```python
import torch
import torch.nn.functional as F

# 输入图像
input = torch.tensor([[1, 2, 0, 3, 1],
                      [0, 1, 2, 3, 1],
                      [1, 2, 1, 0, 0],
                      [5, 2, 3, 1, 1],
                      [2, 1, 0, 1, 1]])

# 卷积核
kernel = torch.tensor([[1, 2, 1],
                       [0, 1, 0],
                       [2, 1, 0]])

# 尺寸变换
input = torch.reshape(input, (1, 1, 5, 5))
kernel = torch.reshape(kernel, (1, 1, 3, 3))

print(input.shape)
print(kernel.shape)

output = F.conv2d(input, kernel, stride=1)
print(output)

output2 = F.conv2d(input, kernel, stride=2)
print(output2)

output3 = F.conv2d(input, kernel, stride=1, padding=1)
print(output3)
```



#### P18 神经网络-卷积层
`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">Conv2d</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:#DF2A3F;">in_channels</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  输入的通道数 彩色图像是3个通道</font>**

_**<font style="color:#DF2A3F;">out_channels</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  输出通道数</font>**

_**<font style="color:#DF2A3F;">kernel_size</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  卷积核的大小 数/元组（3 -> 3*3）满足一定的分布，取多少都无所谓，实际在训练神经网络的过程中就是对它的参数进行不断的调整</font>**

_**<font style="color:#DF2A3F;">stride=1</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  横向和纵向步进大小</font>**

_**<font style="color:#DF2A3F;">padding=0</font>**_**<font style="color:#DF2A3F;background-color:rgb(243, 244, 247);">,  输入图像的边缘进行填充</font>**

_**<font style="color:rgb(38, 38, 38);">dilation=1</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  卷积核当中每一个对应位的距离</font>**

_**<font style="color:rgb(38, 38, 38);">groups=1</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  不改动</font>**

_**<font style="color:rgb(38, 38, 38);">bias=True</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  偏置，常设置为True，对卷积后的结果是否加减一个常数</font>**

_**<font style="color:rgb(38, 38, 38);">padding_mode='zeros'填充方式，‘zero’表示设置成0</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

通道数，输出通道数，卷积核的大小，步进，边缘填充，填充多少，卷积核的距离，1，加一个偏置

[卷积示范](https://github.com/vdumoulin/conv_arithmetic/blob/master/README.md)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776330029273-8ffcda83-48c6-4f75-8a74-dc9b156cc95a.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776329318979-d1e9cc42-52e2-4539-8ac7-3bf2a4ed2b9f.png)

```python
import torch
import torchvision
from torch import nn
from torch.nn import Conv2d
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

dataset = torchvision.datasets.CIFAR10(root='./data', train=True, transform=torchvision.transforms.ToTensor(), download=True)
dataloader = DataLoader(dataset, batch_size=64)

# 搭建简单神经网络
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.conv1 = Conv2d(in_channels=3, out_channels=6, kernel_size=3, stride=1, padding=0)

    def forward(self, x):
        x = self.conv1(x)
        return x

# 初始化网络
tudui = Tudui()

writer = SummaryWriter(log_dir='logs')

step = 0

for data in dataloader:
    imgs, targets = data
    output = tudui(imgs)
    print(imgs.shape)
    print(output.shape)

    # torch.Size([64, 3, 32, 32])
    writer.add_images('input', imgs, step)
    # torch.Size([64, 6, 30, 30]) -> [xxx, 3, 30, 30]

    output = torch.reshape(output, (-1, 3, 30, 30))
    writer.add_images('output', output, step)

    step += 1

writer.close()
```

vgg16 model

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/jpeg/59055276/1776329976804-f9b34bd1-526e-4040-b5a5-1f213120ae4e.jpeg)



#### P19 神经网络-最大池化的使用MaxPool2d
<font style="color:#DF2A3F;">目的：保留输入的特征，同时减小数据量，提高速度</font>

**<font style="color:#DF2A3F;">一般 卷积 -> 池化 -> 非线性激活</font>**

MaxPool 最大池化=下采样

MaxUnpoo 上采样

Maxpool2d

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">MaxPool2d</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:rgb(38, 38, 38);">kernel_size</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  池化盒，一个取最大值的窗口</font>**

_**<font style="color:rgb(38, 38, 38);">stride=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  步进大小，卷积层的默认值是1，这个是kernel_size大小</font>**

_**<font style="color:rgb(38, 38, 38);">padding=0</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  </font>**

_**<font style="color:#E7E9E8;">dilation=1</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#E7E9E8;">return_indices=False</font>**_**<font style="color:#E7E9E8;background-color:rgb(243, 244, 247);">, </font>**

_**<font style="color:rgb(38, 38, 38);">ceil_mode=False 设置为True时使用ceil模式，而不是floor模式</font>**_**<font style="color:rgb(38, 38, 38);">)</font>****<font style="color:#DF2A3F;">True 为 ceil（保留），反之为floor</font>**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/gif/59055276/1776330464588-03fd3e0b-3e90-4ee5-9f59-7e25976bb021.gif)到了边界，池化核比原图像多，是否舍弃

取最大值的窗口，步进（默认为第一个参数），，，True 为 ceil（保留），反之为floor

_**<font style="color:rgb(38, 38, 38);">dilation=1 空洞卷积</font>**_

<!-- 这是一张图片，ocr 内容为： -->
![](https://github.com/vdumoulin/conv_arithmetic/raw/master/gif/dilation.gif)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776330651897-5e4f7e6c-081a-4082-a999-e46123a46227.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776330029273-8ffcda83-48c6-4f75-8a74-dc9b156cc95a.png)

```python
import torch
import torchvision
from torch import nn
from torch.nn import MaxPool2d
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

dataset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=torchvision.transforms.ToTensor())

dataloader = DataLoader(dataset, batch_size=64)


# input = torch.tensor([[1, 2, 0, 3, 1],
#                       [0, 1, 2, 3, 1],
#                       [1, 2, 1, 0, 0],
#                       [5, 2, 3, 1, 1],
#                       [2, 1, 0, 1, 1]], dtype=torch.float32) # dtype=torch.float32 -> 1变成1.0……
#
# input = torch.reshape(input, (-1, 1, 5, 5)) # -1表示自己计算batch_size
# print(input.shape)

class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.maxpool = nn.MaxPool2d(kernel_size=3, ceil_mode=False)

    def forward(self, input):
        output = self.maxpool(input)
        return output

tudui = Tudui()
# output = tudui(input)
# print(output)

writer = SummaryWriter('logs_maxpool')
step = 0

for data in dataloader:
    imgs, targets = data
    writer.add_images('input', imgs, step)
    outputs = tudui(imgs)
    writer.add_images('outputs', outputs, step)
    step += 1

writer.close()
```

最大池化不能对long数据类型进行实现



#### P20 神经网络-非线性激活
**<font style="color:#D8DAD9;">几乎用不到 Padding Layers</font>**

| **<font style="color:rgb(73, 116, 209);">nn.ZeroPad2d</font>** | **<font style="color:rgb(38, 38, 38);">Pads the input tensor boundaries with zero.</font>** |
| :--- | :--- |


| **<font style="color:rgb(73, 116, 209);">nn.ConstantPad1d</font>** | **<font style="color:rgb(38, 38, 38);">Pads the input tensor boundaries with a constant value.</font>** |
| :--- | :--- |


**非线性变换：给网络引入非线性特征，非线性越多才能训练出符合各种曲线/特征的模型**

nn.ReLU：对数据如果小于0进行截断对图像的变换不是很明显，inplace是否原地操作（一般使用默认的False 保留原始数据），<font style="color:#DF2A3F;">输入是（batch_size，*）</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776331553998-6d5c07ae-2b91-4b09-b690-59b62ea21556.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776331891708-fb385eb6-69c9-4be9-bf29-4544d55e81db.png)

sigmoid：

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776331623498-62150ca3-2699-4162-814f-76f613dbc1be.png)

```python
import torch
import torchvision
from torch import nn
from torch.nn import ReLU, Sigmoid
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

input = torch.tensor([[1, -0.5],
                      [-1, 3]])

# 使输入格式满足要求
output = torch.reshape(input, (-1, 1, 2, 2))
print(output.shape)

dataset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=torchvision.transforms.ToTensor())
dataloader = DataLoader(dataset, batch_size=64)

class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        # self.relu1 = ReLU()
        self.sigmoid1 = Sigmoid()

    def forward(self, input):
        # output = self.relu1(input)
        output = self.sigmoid1(input)
        return output

# 创建网络
tudui = Tudui()
# output = tudui(input)
# print(output)

writer = SummaryWriter("logs_relu")
step = 0
for data in dataloader:
    imgs, targets = data
    writer.add_images("input", imgs, global_step=step)
    output = tudui(imgs)
    writer.add_images("output", output, global_step=step)
    step += 1

writer.close()
```



#### P21 神经网络-线性层及其他层介绍
**正则化层：**

正则化可以加快神经网络的训练速度，<font style="color:#DF2A3F;">防止过拟合</font>

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">BatchNorm2d</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:rgb(38, 38, 38);">num_features</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:#DF2A3F;">C</font>**_**<font style="color:#DF2A3F;"> from an expected input of size (N,C,H,W)</font>**

_**<font style="color:rgb(38, 38, 38);">eps=1e-05</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">momentum=0.1</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">affine=True</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">track_running_stats=True</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

```python
>>> # With Learnable Parameters
>>> m = nn.BatchNorm2d(100)
>>> # Without Learnable Parameters
>>> m = nn.BatchNorm2d(100, affine=False)
>>> input = torch.randn(20, 100, 35, 45)
>>> output = m(input)
```



**<font style="color:rgb(38, 38, 38);">Recurrent Layers</font>**

recurrent 用于文字识别

**<font style="color:rgb(38, 38, 38);">Transformer Layers：在特定的网络中提出来的一种结构</font>**

**<font style="color:#DF2A3F;">线性层 linear：全连接层</font>**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333003343-dfbfb727-c2e9-4ed9-bf61-50d6c67c7a98.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333214326-1ded02a2-c513-43ab-ab42-7ac9c0f1e8b0.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333259070-2d7cbaec-8f6d-4748-9706-7f8aae2168a6.png)

4096 -> 1000

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333674124-0e08afa1-4bd1-4cfe-90dc-22704fe5a5ab.png)

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">Linear</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:rgb(38, 38, 38);">in_features</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  输入的个数</font>**

_**<font style="color:rgb(38, 38, 38);">out_features</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  输出的个数</font>**

_**<font style="color:rgb(38, 38, 38);">bias=True 偏置，加不加b</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

```python
import torch
import torchvision
from torch import nn
from torch.nn import Linear
from torch.utils.data import DataLoader

dataset = torchvision.datasets.CIFAR10(root='./data', train=False, transform=torchvision.transforms.ToTensor(), download=True)

dataloader = DataLoader(dataset, batch_size=64)

class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.linear1 = Linear(196608, 10)

    def forward(self, input):
        output = self.linear1(input)
        return output

tudui = Tudui()

for data in dataloader:
    imgs, targets = data
    print(imgs.shape)
    # output = torch.reshape(imgs, (1, 1, 1, -1))
    output = torch.flatten(imgs) # 把它摊平
    print(output.shape)
    output = tudui(output)
    print(output.shape)
```



**<font style="color:rgb(38, 38, 38);">Dropout Layers</font>**

dropout：在训练的过程中，会随机地把一些输入的tensor数据类型把其中一些元素变为0，变成0的概率为p，<font style="color:#DF2A3F;">防止过拟合</font>

**<font style="color:rgb(38, 38, 38);">Sparse Layers</font>**

sparse：用于自然语言处理

**<font style="color:rgb(38, 38, 38);">Distance Functions：计算两个值之间的误差是通过什么样的方式去衡量的</font>**

**<font style="color:rgb(38, 38, 38);">Loss Functions：Loss误差大小是多少</font>**



#### P22 神经网络-搭建小实战和Sequential的使用
使代码更加简洁

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333864247-9f560698-6dda-4a0c-92c6-46c3e8a647d7.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776333900082-bc3c2896-bc95-49ec-84be-df44a3384ea0.png)

👆CIFAR10 model结构

```python
import torch
from torch import nn
from torch.nn import MaxPool2d, Conv2d, Flatten, Linear, Sequential
from torch.utils.tensorboard import SummaryWriter


class TUdui(nn.Module):
    def __init__(self):
        super(TUdui, self).__init__()
        # self.conv1 = Conv2d(3, 32, 5, padding=2)
        # self.maxpool1 = MaxPool2d(2)
        # self.conv2 = Conv2d(32, 32, 5, padding=2)
        # self.maxpool2 = MaxPool2d(2)
        # self.conv3 = Conv2d(32, 64, 5, padding=2)
        # self.maxpool3 = MaxPool2d(2)
        # self.flatten = Flatten()
        # self.linear1 = Linear(1024, 64)
        # self.linear2 = Linear(64, 10)

        self.model1 = Sequential(
            Conv2d(3, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 64, 5, padding=2),
            MaxPool2d(2),
            Flatten(),
            Linear(1024, 64),
            Linear(64, 10)

        )

    def forward(self, x):
        # x = self.conv1(x)
        # x = self.maxpool1(x)
        # x = self.conv2(x)
        # x = self.maxpool2(x)
        # x = self.conv3(x)
        # x = self.maxpool3(x)
        # x = self.flatten(x)
        # x = self.linear1(x)
        # x = self.linear2(x)
        x = self.model1(x)
        return x

tudui = TUdui()
print(tudui)

# 检验网络结构
input = torch.ones((64, 3, 32, 32)) # 都是1
output = tudui(input)
print(output.shape)

writer = SummaryWriter('logs_seq')
writer.add_graph(tudui, input)
writer.close()
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776334215002-739943db-69f0-4068-bb85-758ea3f96137.png)

add_graph(tudui, input) 计算图



#### P23 损失函数与反向传播
loss = 实际和想要的差距，越小越好

通过**loss**提高输出

1. 计算实际输出和目标之间的差距
2. 为我们更新输出提供一定的依据（反向传播）-> 算grad

（通过loss，对卷积层的卷积核参数进行调整，通过梯度grad(在每一个卷积核参数上)进行优化）

梯度下降：<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/webp/59055276/1776338132631-6e417d52-ff8e-42c7-bed2-8c03d726d76a.webp)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776337352165-9d2c7fd6-8dbb-466d-9c60-27c261258e68.png)

**L1Loss：**

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">L1Loss</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**_**<font style="color:rgb(38, 38, 38);">size_average=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">reduce=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">reduction='mean' or 'sum'</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776337085461-4d884f7a-2c5c-40c6-9f58-9f04361a68f7.png)

**MSELoss：**平方差

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.nn.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">MSELoss</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**_**<font style="color:rgb(38, 38, 38);">size_average=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">reduce=None</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">reduction='mean'</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

**<font style="color:rgb(33, 37, 41);">CrossEntropyLoss：</font>**<font style="color:rgb(33, 37, 41);">交叉熵（常用于分类的损失函数）</font>

<font style="color:rgb(38, 38, 38);">The input is expected to contain raw, unnormalized scores for each class.</font>

<font style="color:rgb(38, 38, 38);">（输入是没有处理过的对每一类的得分）</font>

<font style="color:rgb(38, 38, 38);">It is useful when training a classification problem with C classes.</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776337542637-b0b21b80-7f5f-4c60-9bea-bca5f448d599.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776337563682-b91389e0-4def-478d-a504-191e64e9fbd2.png)

```python
import torch
from torch.nn import L1Loss, MSELoss
from torch import nn

inputs = torch.tensor([1, 2, 3], dtype=torch.float32)
targets = torch.tensor([1, 2, 5], dtype=torch.float32)

inputs = torch.reshape(inputs, (1, 1, 1, 3))
targets = torch.reshape(targets, (1, 1, 1, 3))

loss = L1Loss(reduction='sum')
result = loss(inputs, targets)

loss_mse = MSELoss()
result_mse = loss_mse(inputs, targets)

print(result)
print(result_mse)

x = torch.tensor([0.1, 0.2, 0.3])
y = torch.tensor([1])
x = torch.reshape(x, (1, 3))
# 交叉熵
loss_cross = nn.CrossEntropyLoss()
result_cross = loss_cross(x, y)
print(result_cross)
```

```python
import torchvision
from torch.nn import Conv2d, MaxPool2d, Flatten, Linear, Sequential
from torch import nn
from torch.utils.data import DataLoader

dataset = torchvision.datasets.CIFAR10(root='./data', train=False, transform=torchvision.transforms.ToTensor(), download=True)

dataloader = DataLoader(dataset, batch_size=1)

class TUdui(nn.Module):
    def __init__(self):
        super(TUdui, self).__init__()
        self.model1 = Sequential(
            Conv2d(3, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 64, 5, padding=2),
            MaxPool2d(2),
            Flatten(),
            Linear(1024, 64),
            Linear(64, 10)

        )

    def forward(self, x):
        x = self.model1(x)
        return x
# 交叉熵        
loss = nn.CrossEntropyLoss()
tudui = TUdui()
for data in dataloader:
    imgs, targets = data
    outputs = tudui(imgs)
    # print(outputs)
    # print(targets)
    result_loss = loss(outputs, targets)
    # print(result_loss)
    
    # 反向传播
    result_loss.backward()
    print("ok")
```



#### P24 优化器（一）
优化器：利用梯度来对神经网络当中的一些参数进行更新

[torch.optim](https://docs.pytorch.org/docs/1.8.1/optim.html)

怎样使用：先构造 -> **选择对应优化器的算法（放入模型的参数，学习速率，）**

    调用step方法：利用之前得到的梯度来对参数进行更新

```python
optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9) # 选择对应优化器的算法（放入模型的参数，学习速率，）
optimizer = optim.Adam([var1, var2], lr=0.0001)
```

```python
for input, target in dataset:
    optimizer.zero_grad() # 把反向传播算出来的梯度进行清零，以防上一步的梯度造成影响
    output = model(input)
    loss = loss_fn(output, target)
    loss.backward() # 反向传播
    optimizer.step() # 卷积核的一些参数进行调整
```

Lr = Learning rate 学习速率：不能设置太大也不能太小，太大模型训练起来很不稳定，太小的话就很慢，一般情况下，一开始采用比较大的学习速率进行学习，学习到后面采用比较小的学习速率进行学习

**<font style="color:#DF2A3F;">Algorithms：前两项是一样的</font>**

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torch.optim.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">Adadelta</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**_**<font style="color:rgb(38, 38, 38);">params</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  模型的参数，使优化器知道模型长什么样，可调节的参数有哪些</font>**

_**<font style="color:rgb(38, 38, 38);">lr=1.0</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">rho=0.9</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">eps=1e-06</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">, </font>**_**<font style="color:rgb(38, 38, 38);">weight_decay=0</font>**_**<font style="color:rgb(38, 38, 38);">)</font>**

```python
import torch
import torchvision
from torch.nn import Conv2d, MaxPool2d, Flatten, Linear, Sequential
from torch import nn
from torch.utils.data import DataLoader

dataset = torchvision.datasets.CIFAR10(root='./data', train=False, transform=torchvision.transforms.ToTensor(), download=True)

dataloader = DataLoader(dataset, batch_size=1)

class TUdui(nn.Module):
    def __init__(self):
        super(TUdui, self).__init__()
        self.model1 = Sequential(
            Conv2d(3, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 32, 5, padding=2),
            MaxPool2d(2),
            Conv2d(32, 64, 5, padding=2),
            MaxPool2d(2),
            Flatten(),
            Linear(1024, 64),
            Linear(64, 10)

        )

    def forward(self, x):

        x = self.model1(x)
        return x
loss = nn.CrossEntropyLoss()
tudui = TUdui()
# 设置优化器
optim = torch.optim.SGD(tudui.parameters(), lr=0.01) # 随机梯度下降
for epoch in range(20): # 训练20轮
    running_loss = 0.0 # 每一轮的loss
    for data in dataloader:
        imgs, targets = data
        outputs = tudui(imgs)
        result_loss = loss(outputs, targets)
        optim.zero_grad() # 梯度调为0
        result_loss.backward() # 反向传播计算梯度
        optim.step() # 对参数进行调优
        running_loss += result_loss
    print(running_loss)
```



#### P25 现有网络模型的使用及修改
[torchvision.models](https://docs.pytorch.org/vision/0.9/models.html)

+ <font style="color:rgb(38, 38, 38);">torchvision.models</font>
    - <font style="color:rgb(108, 108, 109);">Classification 分类</font>
    - <font style="color:rgb(108, 108, 109);">Semantic Segmentation 语义分割</font>
    - <font style="color:rgb(108, 108, 109);">Object Detection, Instance Segmentation and Person Keypoint Detection 目标检测</font>
    - <font style="color:rgb(108, 108, 109);">Video classification</font>

VGG 常用16/19

VGG16：

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">torchvision.models.</font>**``**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">vgg16</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**

_**<font style="color:rgb(38, 38, 38);">pretrained: bool = False</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  </font>**<font style="color:#DF2A3F;">If True, returns a model pre-trained on ImageNet</font>

<font style="color:#DF2A3F;">选择True，下载的网络模型其中的一些参数已经在ImageNet这个数据集中已经训练好了，取得了不错的效果，反之为初始化的参数</font>

_**<font style="color:rgb(38, 38, 38);">progress: bool = True</font>**_**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">,  是否显示下载进度条</font>**

_**<font style="color:rgb(38, 38, 38);">**kwargs</font>**_**<font style="color:rgb(38, 38, 38);">)</font>****<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);"> → torchvision.models.vgg.VGG</font>**

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776340213016-7b77180c-62ed-48f6-8ede-2ec730d736bc.png)

```python
import torchvision.datasets
from torch import nn

# train_data = torchvision.datasets.ImageNet("./data_image_net", split="train", download=True, transform=torchvision.transforms.ToTensor())

vgg16_false = torchvision.models.vgg16(pretrained=False)
vgg16_true = torchvision.models.vgg16(pretrained=True)  # 训练好的，需要下载

print(vgg16_true)

train_data = torchvision.datasets.CIFAR10('./data', train=True, download=True, transform=torchvision.transforms.ToTensor())
# 利用现有的网络改动结构以符合我的需求 可以把1000改成10，再加一个全连接层

# vgg16_true.add_module("add_linear", nn.Linear(1000, 10))
# 加一个线性层
vgg16_true.classifier.add_module("add_linear", nn.Linear(1000, 10)) # 加到classifier里面
print(vgg16_true)

print(vgg16_false)
vgg16_false.classifier[6] = nn.Linear(4096, 10)  # 修改
print(vgg16_false)
```

许多的框架会把VGG16当作一个前置的网络结构，用它来提取一些特殊的特征，再加一些网络结构实现一个功能



#### P26 网络模型的保存与读取
```python
import torchvision
import torch
from torch import nn

vgg16 = torchvision.models.vgg16(pretrained=False)
# 保存方式1，模型结构+模型参数
torch.save(vgg16, 'vgg16_method1.pth') # 第二个为保存的路径

# 保存方式2：模型参数（官方推荐） 把VGG16的状态/参数保存成字典型
torch.save(vgg16.state_dict(), "vgg16_method2.pth")

# 陷阱（方式1）
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.conv1 = nn.Conv2d(3,64, kernel_size=3)

    def forward(self, x):
        x = self.conv1(x)
        return x

tudui = Tudui()
torch.save(tudui, "tudui_method1.pth")
```

```python
import torch
import torchvision
from torch import nn
# from model_save import * # 不用复制过来

# 方式1 -> 保存方式1，加载模型
# model = torch.load("vgg16_method1.pth")
# print(model)

# 方式2，加载模型
# vgg16 = torchvision.models.vgg16(pretrained=False)
# vgg16.load_state_dict(torch.load("vgg16_method2.pth")) # 恢复成网络模型

# model = torch.load("vgg16_method2.pth")
# print(model)
# print(vgg16)

# class Tudui(nn.Module):
#     def __init__(self):
#         super(Tudui, self).__init__()
#         self.conv1 = nn.Conv2d(3,64, kernel_size=3)
#
#     def forward(self, x):
#         x = self.conv1(x)
#         return x

# 陷阱1（会报错）得把网络结构给它复制过来，不需要写tudui=Tudui()来创建
model = torch.load('tudui_method1.pth')
print(model)
```



#### P27 完整的模型训练套路（一）以CIFAR10数据集
```python
import torch
from torch import nn

# 搭建神经网络
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Flatten(), # 展平
            nn.Linear(64 * 4 * 4, 64),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.model(x)
        return x

if __name__ == '__main__': # 测试网络的正确性
    tudui = Tudui()
    input = torch.ones((64, 3, 32, 32))
    output = tudui(input)
    print(output.shape)
```

```python
import torchvision
from torch import nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter

from model import *

# 准备数据集
train_data = torchvision.datasets.CIFAR10(root="./data", train=True, transform=torchvision.transforms.ToTensor(), download=True)
test_data = torchvision.datasets.CIFAR10(root="./data", train=False, transform=torchvision.transforms.ToTensor(), download=True)

# length 长度 看一下有多少张图片
train_data_size = len(train_data)
test_data_size = len(test_data)
# 如果train_data_size=10，训练数据集的长度为：10
print("训练数据集的长度为：{}".format(train_data_size))
print("测试数据集的长度为：{}".format(test_data_size))

# 利用 DataLoader 来加载数据集
train_dataloader = DataLoader(train_data, batch_size=64)
test_dataloader = DataLoader(test_data, batch_size=64)

# 创建网络模型
tudui = Tudui()

# 损失函数
loss_fn = nn.CrossEntropyLoss() # 分类问题，交叉熵

# 优化器 随机梯度下降SDG
# learning_rate = 0.01
learning_rate = 1e-2 # 方便修改
optimizer = torch.optim.SGD(tudui.parameters(), lr=learning_rate)

# 设置训练网络的一些参数
# 记录训练的次数
total_train_step = 0
# 记录测试的次数
total_test_step = 0
# 训练的轮数
epoch = 10

# 添加tensorboard 可以画图
writer = SummaryWriter('logs_train')

for i in range(epoch):
    print("---------第 {} 轮训练开始---------".format(i+1))

    # 训练步骤开始
    # tudui.train()  只对一部分网络层有作用
    for data in train_dataloader: # 取数据
        imgs, targets = data
        outputs = tudui(imgs)
        loss = loss_fn(outputs, targets) # 计算损失

        # 优化器优化模型
        optimizer.zero_grad()
        loss.backward()
        optimizer.step() # 参数优化

        total_train_step += 1 # 训练次数加1
        if total_train_step % 100 == 0: # 不让每次都打印
            print("训练次数：{}，Loss: {}".format(total_train_step, loss.item()))
            writer.add_scalar('train_loss', loss.item(), total_train_step)

    # 测试步骤开始，用来知道训练效果（每一轮都看一次）
    # tudui.eval()  只对一部分网络层有作用
    total_test_loss = 0
    total_accuracy = 0 # 整体正确的个数
    with torch.no_grad(): # with里面的代码没有梯度了，保证不会进行调优
        for data in test_dataloader:
            imgs, targets = data
            outputs = tudui(imgs)
            loss = loss_fn(outputs, targets)
            total_test_loss += loss.item()
            accuracy = (outputs.argmax(1) == targets).sum() # 一小部分正确的个数
            total_accuracy += accuracy

    print("整体测试集上的Loss: {}".format(total_test_loss))
    print("整体测试集上的正确率：{}".format(total_accuracy/test_data_size))
    writer.add_scalar('test_loss', total_test_loss, total_test_step)
    writer.add_scalar('test_accuracy', total_accuracy/test_data_size, total_test_step)
    total_test_step += 1

    torch.save(tudui, "tudui_{}.pth".format(i))
    # torch.save(tudui.state_dict(), "tudui_{}.pth".format(i)) 官方推荐的保存方式
    print('模型已保存')

writer.close()
```

62行：loss.item()，变成真实的数字，没有item()是tensor数据类型

#### P28 完整的模型训练套路（二）
分类问题 -> 正确率作为衡量指标

2 x input

Model(2分类)



Outputs = 

[0.1, 0.2]

[0.3, 0.4]

  0     1



Argmax -> 比较正确率：能求出横向最大值所在的位置，比如第一行的0.2



Preds = [1]

             [1]

Input target = [0][1]：目标



Preds == input target：求出对应位置相等的个数有多少

[false, true].sum() = 1   -> 拿1和0比False，拿1和1比True

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776343336213-0125aead-463c-44d9-a0ce-3feeb6a68341.png)输出：tensor([1, 1])

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776343377647-040fa3ef-370d-4f34-99e3-9336978b1257.png)输出：tensor([0, 1])

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776343446758-f43672d6-3e8b-4fae-b6c2-209a12b5848b.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776343453968-3e0e2933-2f80-499f-80ed-401145a75a16.png)

#### P29 完整的模型训练套路（三）
细节：   

    # 训练步骤开始

    # tudui.train()  只对一部分网络层有作用

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">train</font>**`**<font style="color:rgb(38, 38, 38);">(</font>**_**<font style="color:rgb(38, 38, 38);">mode=True</font>**_**<font style="color:rgb(38, 38, 38);">)：</font>**

<font style="color:rgb(38, 38, 38);">Sets the module in training mode.</font>

<font style="color:rgb(38, 38, 38);">This has any effect only on certain modules. See documentations of particular modules for details of their behaviors in training/evaluation mode, if they are affected, e.g. </font><font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Dropout</font><font style="color:rgb(38, 38, 38);">, </font>`<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">BatchNorm</font>`<font style="color:rgb(38, 38, 38);">, etc.</font>



    # 测试步骤开始，用来知道训练效果（每一轮都看一次）

    # tudui.eval()  只对一部分网络层有作用

`**<font style="color:rgb(38, 38, 38);background-color:rgb(243, 244, 247);">eval</font>**`**<font style="color:rgb(38, 38, 38);">()</font>**

<font style="color:rgb(38, 38, 38);">Sets the module in evaluation mode.</font>

<font style="color:rgb(38, 38, 38);">This has any effect only on certain modules. See documentations of particular modules for details of their behaviors in training/evaluation mode, if they are affected, e.g. </font>[<font style="color:rgb(73, 116, 209);background-color:rgb(243, 244, 247);">Dropout</font>](https://docs.pytorch.org/docs/1.8.1/generated/torch.nn.Dropout.html#torch.nn.Dropout)<font style="color:rgb(38, 38, 38);">, </font>`<font style="color:rgb(108, 108, 109);background-color:rgb(243, 244, 247);">BatchNorm</font>`<font style="color:rgb(38, 38, 38);">, etc.</font>



**<font style="color:#DF2A3F;">总结：准备数据、加载数据、准备模型、设置损失函数、设置优化器、开始训练、最后验证、结构聚合展示</font>**

#### P30 利用GPU训练（一）
找到以下三种变量：

<font style="color:#DF2A3F;">网络模型</font>

<font style="color:#DF2A3F;">数据（输入，标注）</font>

<font style="color:#DF2A3F;">损失函数</font>

**调用.cuda()**

```python
import torch
import torchvision
from torch import nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
import time # 计时


# 准备数据集
train_data = torchvision.datasets.CIFAR10(root="./data", train=True, transform=torchvision.transforms.ToTensor(), download=True)
test_data = torchvision.datasets.CIFAR10(root="./data", train=False, transform=torchvision.transforms.ToTensor(), download=True)

# length 长度
train_data_size = len(train_data)
test_data_size = len(test_data)
# 如果train_data_size=10，训练数据集的长度为：10
print("训练数据集的长度为：{}".format(train_data_size))
print("测试数据集的长度为：{}".format(test_data_size))

# 利用 DataLoader 来加载数据集
train_dataloader = DataLoader(train_data, batch_size=64)
test_dataloader = DataLoader(test_data, batch_size=64)

# 创建网络模型
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 64),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.model(x)
        return x
tudui = Tudui()
if torch.cuda.is_available(): # 如果cuda可用
    tudui = tudui.cuda()

# 损失函数
loss_fn = nn.CrossEntropyLoss()
if torch.cuda.is_available():
    loss_fn = loss_fn.cuda()

# 优化器 随机梯度下降
# learning_rate = 0.01
learning_rate = 1e-2
optimizer = torch.optim.SGD(tudui.parameters(), lr=learning_rate)

# 设置训练网络的一些参数
# 记录训练的次数
total_train_step = 0
# 记录测试的次数
total_test_step = 0
# 训练的轮数
epoch = 10

# 添加tensorboard
writer = SummaryWriter('logs_train')
start_time = time.time() # 开始时间
for i in range(epoch):
    print("---------第 {} 轮训练开始---------".format(i+1))

    # 训练步骤开始
    # tudui.train()  只对一部分网络层有作用
    for data in train_dataloader:
        imgs, targets = data
        if torch.cuda.is_available():
            imgs = imgs.cuda()
            targets = targets.cuda()
        outputs = tudui(imgs)
        loss = loss_fn(outputs, targets)

        # 优化器优化模型
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_train_step += 1
        if total_train_step % 100 == 0:
            end_time = time.time() # 结束时间
            print(end_time - start_time)
            print("训练次数：{}，Loss: {}".format(total_train_step, loss.item()))
            writer.add_scalar('train_loss', loss.item(), total_train_step)

    # 测试步骤开始
    # tudui.eval()  只对一部分网络层有作用
    total_test_loss = 0
    total_accuracy = 0
    with torch.no_grad():
        for data in test_dataloader:
            imgs, targets = data
            if torch.cuda.is_available():
                imgs = imgs.cuda()
                targets = targets.cuda()
            outputs = tudui(imgs)
            loss = loss_fn(outputs, targets)
            total_test_loss += loss.item()
            accuracy = (outputs.argmax(1) == targets).sum()
            total_accuracy += accuracy

    print("整体测试集上的Loss: {}".format(total_test_loss))
    print("整体测试集上的正确率：{}".format(total_accuracy/test_data_size))
    writer.add_scalar('test_loss', total_test_loss, total_test_step)
    writer.add_scalar('test_accuracy', total_accuracy/test_data_size, total_test_step)
    total_test_step += 1

    torch.save(tudui, "tudui_{}.pth".format(i))
    # torch.save(tudui.state_dict(), "tudui_{}.pth".format(i))
    print('模型已保存')

writer.close()
```

44行，50行，77行，102行

**colab：（每周可以免费使用30个小时GPU）**



#### P31 利用GPU训练（二）
第二种方式（更长用）

.to(device)

Device = torch.device("cpu")

Torch.device("cuda")

Torch.device("cuda:0")

Torch.device("cuda:1")，指定第二张显卡

<font style="color:#DF2A3F;">device = torch.device("cuda" if torch.cuda.is_available() else "cpu")</font>

```python
import torch
import torchvision
from torch import nn
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
import time

# 定义训练的设备
device = torch.device("cuda:0")
print(device)

# 准备数据集
train_data = torchvision.datasets.CIFAR10(root="./data", train=True, transform=torchvision.transforms.ToTensor(), download=True)
test_data = torchvision.datasets.CIFAR10(root="./data", train=False, transform=torchvision.transforms.ToTensor(), download=True)

# length 长度
train_data_size = len(train_data)
test_data_size = len(test_data)
# 如果train_data_size=10，训练数据集的长度为：10
print("训练数据集的长度为：{}".format(train_data_size))
print("测试数据集的长度为：{}".format(test_data_size))

# 利用 DataLoader 来加载数据集
train_dataloader = DataLoader(train_data, batch_size=64)
test_dataloader = DataLoader(test_data, batch_size=64)

# 创建网络模型
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 64),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.model(x)
        return x
tudui = Tudui()
tudui = tudui.to(device)

# 损失函数
loss_fn = nn.CrossEntropyLoss()
loss_fn = loss_fn.to(device)

# 优化器 随机梯度下降
# learning_rate = 0.01
learning_rate = 1e-2
optimizer = torch.optim.SGD(tudui.parameters(), lr=learning_rate)

# 设置训练网络的一些参数
# 记录训练的次数
total_train_step = 0
# 记录测试的次数
total_test_step = 0
# 训练的轮数
epoch = 10

# 添加tensorboard
writer = SummaryWriter('logs_train')
start_time = time.time()
for i in range(epoch):
    print("---------第 {} 轮训练开始---------".format(i+1))

    # 训练步骤开始
    # tudui.train()  只对一部分网络层有作用
    for data in train_dataloader:
        imgs, targets = data
        imgs = imgs.to(device)
        targets = targets.to(device)
        outputs = tudui(imgs)
        loss = loss_fn(outputs, targets)

        # 优化器优化模型
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_train_step += 1
        if total_train_step % 100 == 0:
            end_time = time.time()
            print(end_time - start_time)
            print("训练次数：{}，Loss: {}".format(total_train_step, loss.item()))
            writer.add_scalar('train_loss', loss.item(), total_train_step)

    # 测试步骤开始
    # tudui.eval()  只对一部分网络层有作用
    total_test_loss = 0
    total_accuracy = 0
    with torch.no_grad():
        for data in test_dataloader:
            imgs, targets = data
            imgs = imgs.to(device)
            targets = targets.to(device)
            outputs = tudui(imgs)
            loss = loss_fn(outputs, targets)
            total_test_loss += loss.item()
            accuracy = (outputs.argmax(1) == targets).sum()
            total_accuracy += accuracy

    print("整体测试集上的Loss: {}".format(total_test_loss))
    print("整体测试集上的正确率：{}".format(total_accuracy/test_data_size))
    writer.add_scalar('test_loss', total_test_loss, total_test_step)
    writer.add_scalar('test_accuracy', total_accuracy/test_data_size, total_test_step)
    total_test_step += 1

    torch.save(tudui, "tudui_{}.pth".format(i))
    # torch.save(tudui.state_dict(), "tudui_{}.pth".format(i))
    print('模型已保存')

writer.close()
```



#### P32 完整的模型验证套路
模型验证（测试，demo）——利用已经训练好的模型，然后给它提供输入

png是4个通道：还有一个透明通道

```python
import torch
import torchvision
from PIL import Image
from torch import nn

image_path = 'dog.png'
image = Image.open(image_path) # 读取PIL Image
print(image)
image = image.convert('RGB')

transform = torchvision.transforms.Compose([torchvision.transforms.Resize((32, 32)),
                                            torchvision.transforms.ToTensor()])
image = transform(image)
print(image.shape)

# 加载网络模型
class Tudui(nn.Module):
    def __init__(self):
        super(Tudui, self).__init__()
        self.model = nn.Sequential(
            nn.Conv2d(3, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 32, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 5, 1, 2),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 4 * 4, 64),
            nn.Linear(64, 10)
        )

    def forward(self, x):
        x = self.model(x)
        return x

model = torch.load("tudui_0.pth", weights_only=False)
# model = torch.load("tudui_0.pth", weights_only=False, map_location=torch.device('cpu')) # GPU上训练的要映射到CPU上
print(model)
torch.reshape(image, (1, 3, 32, 32))
image = image.unsqueeze(0)
model.eval()
with torch.no_grad(): # 可以节约内存、性能
    output = model(image)
print(output)

print(output.argmax(1))
```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776345074807-0d59811b-4a90-48f7-8893-8e6516973b8e.png)



#### P33 【完结】看看开源项目
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776345715997-abe7a0d6-7345-4438-8f60-48747856430a.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776345753191-fcee91d0-6421-4008-ac67-6b935938ac2a.png)

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776345922372-567260c6-83f7-4207-ac34-e3d22cf3c5e0.png)

required：需要指定

default：可要可不要

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/59055276/1776346063956-d8b42d6c-1316-415b-82dd-f3fe328639d4.png)

