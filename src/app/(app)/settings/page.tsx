import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <>
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details and security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                        <Input id="email" type="email" defaultValue="student@example.com" />
                        <Button variant="outline">Change</Button>
                    </div>
                </div>
                <Separator/>
                <div className="space-y-2">
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground">Change your password for added security.</p>
                     <Button variant="outline">Change Password</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive">
             <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                   Manage your account data and permanent actions.
                </CardDescription>
            </CardHeader>
             <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </CardContent>
        </Card>
    </>
  )
}
