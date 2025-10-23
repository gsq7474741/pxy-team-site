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
        <h1 className="text-4xl font-bold tracking-tight">联系我们</h1>
        {contactData?.content && (
          <div
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: contactData.content }}
          />
        )}
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
              {contactData?.phone && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">电话</h3>
                    <p className="text-muted-foreground">{contactData.phone}</p>
                  </div>
                </div>
              )}
              {contactData?.email && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">邮箱</h3>
                    <p className="text-muted-foreground">{contactData.email}</p>
                  </div>
                </div>
              )}
              {contactData?.address && (
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">地址</h3>
                    <p className="text-muted-foreground">{contactData.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 去除硬编码的办公时间与社交链接区块，所有内容由 CMS 管理 */}
        </div>
      </div>
      
      {contactData?.mapEmbedCode && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">我们的位置</h2>
          <div className="h-[820px] rounded-lg overflow-hidden">
            <div
              className="h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:block"
              dangerouslySetInnerHTML={{ __html: contactData.mapEmbedCode }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
