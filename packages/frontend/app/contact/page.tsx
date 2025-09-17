import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contactApi, type ContactPageViewModel } from "@/lib/strapi-client";

export default async function ContactPage() {
  // 获取联系页面数据
  let contactData: ContactPageViewModel | null = null;
  try {
    contactData = await contactApi.getContactPage();
  } catch (error) {
    console.error("获取联系页面数据失败:", error);
  }
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{contactData?.title || "联系我们"}</h1>
        <div className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto" 
             dangerouslySetInnerHTML={{ __html: contactData?.content || "如果您有任何问题或合作意向，欢迎通过以下方式与我们取得联系。" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 联系表单 */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>发送消息</CardTitle>
              <CardDescription>
                填写下面的表单，我们将尽快回复您。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input id="name" placeholder="请输入您的姓名" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" type="email" placeholder="请输入您的邮箱" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">主题</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择联系主题" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">一般咨询</SelectItem>
                      <SelectItem value="research">研究合作</SelectItem>
                      <SelectItem value="join">加入课题组</SelectItem>
                      <SelectItem value="media">媒体咨询</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">消息内容</Label>
                  <Textarea id="message" placeholder="请输入您的消息内容" rows={5} />
                </div>
                
                <Button type="submit" className="w-full">发送消息</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* 联系信息 */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">联系方式</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">电话</h3>
                  <p className="text-muted-foreground">{contactData?.phone || "[课题组电话]"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">邮箱</h3>
                  <p className="text-muted-foreground">{contactData?.email || "[课题组邮箱]"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">地址</h3>
                  <p className="text-muted-foreground">{contactData?.address || "[课题组详细地址]"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">办公时间</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">周一至周五</span>
                <span>9:00 - 17:30</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">周六至周日</span>
                <span>休息</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">关注我们</h2>
            <div className="flex gap-4">
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="bg-muted p-2 rounded-full hover:bg-muted/80 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* 地图占位 */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">我们的位置</h2>
        <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">此处将显示地图</p>
        </div>
      </div>
    </div>
  );
}
