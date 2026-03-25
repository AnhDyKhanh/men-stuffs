import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";

interface RequireLoginDialogProps {
  showRequireLoginDialog: boolean
  onClose: () => void
}

export default function RequireLoginDialog(props: RequireLoginDialogProps) {
  const { showRequireLoginDialog, onClose } = props
  const router = useRouter()
  const pathname = usePathname()

  const handleLogin = () => {
    router.push(`/login?redirect=${pathname}`)
  }

  return (
    <Dialog open={showRequireLoginDialog} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Vui lòng đăng nhập để tiếp tục hành động này.
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Quay lại</Button>
          <Button onClick={handleLogin}>Đăng nhập</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}