'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter()
  const handleBackToHome = () => {
    router.push('/')
  }
  return (
    <Dialog open={true}>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Lỗi</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-lg text-muted-foreground">
          Lỗi xảy ra khi truy cập trang này. Vui lòng thử lại sau.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleBackToHome}>Quay lại trang chủ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}