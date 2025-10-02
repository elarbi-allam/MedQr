
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Activity,
  Calendar,
  QrCode,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { mockDocuments, mockActionItems, mockPrescriptions, mockTemporaryAccess } from "@/lib/mock-data"

export default function PatientDashboard() {
  const recentDocuments = mockDocuments.slice(0, 3)
  const pendingActions = mockActionItems.filter(
    (a) => a.agreement_status === "AGREED" || a.agreement_status === "PENDING",
  )
  const activeAccess = mockTemporaryAccess.filter((a) => a.status === "ACTIVE")

  return (
      <div className="min-h-screen p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Welcome back, Sarah</h1>
          <p className="text-muted-foreground text-lg">Here's an overview of your medical records and activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 glass-effect border-primary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Total Documents</p>
                <p className="text-4xl font-bold">{mockDocuments.length}</p>
                <div className="flex items-center gap-1 text-xs text-secondary font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>+15.9%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-secondary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Pending Actions</p>
                <p className="text-4xl font-bold">{pendingActions.length}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-accent/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Active Access</p>
                <p className="text-4xl font-bold">{activeAccess.length}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3" />
                  <span>Currently shared</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-chart-4/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Prescriptions</p>
                <p className="text-4xl font-bold">{mockPrescriptions.length}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span>Active treatments</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Documents */}
          <Card className="lg:col-span-2 p-6 glass-effect">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Recent Documents</h2>
              <Link href="/patient/documents">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.document_id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(doc.upload_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {doc.type.toLowerCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 glass-effect">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/patient/access">
                <Button
                  className="w-full justify-start h-11 bg-primary/10 text-primary hover:bg-primary/20"
                  variant="ghost"
                >
                  <QrCode className="w-5 h-5 mr-3" />
                  Generate QR Code
                </Button>
              </Link>
              <Link href="/patient/documents">
                <Button className="w-full justify-start h-11 bg-transparent" variant="outline">
                  <FileText className="w-5 h-5 mr-3" />
                  Upload Document
                </Button>
              </Link>
              <Link href="/patient/prescriptions">
                <Button className="w-full justify-start h-11 bg-transparent" variant="outline">
                  <Calendar className="w-5 h-5 mr-3" />
                  View Prescriptions
                </Button>
              </Link>
              <Link href="/patient/history">
                <Button className="w-full justify-start h-11 bg-transparent" variant="outline">
                  <Activity className="w-5 h-5 mr-3" />
                  Medical History
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <Card className="p-6 glass-effect">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Pending Actions</h2>
              <Link href="/patient/prescriptions">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {pendingActions.map((action) => {
                const prescription = mockPrescriptions.find((p) => p.prescription_id === action.prescription_id)
                return (
                  <div
                    key={action.action_id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/10 border border-secondary/20 hover:bg-secondary/15 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{prescription?.details}</h3>
                      <p className="text-sm text-muted-foreground">Status: {action.agreement_status}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {action.agreement_status.toLowerCase()}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>
        )}
      </div>
  )
}
