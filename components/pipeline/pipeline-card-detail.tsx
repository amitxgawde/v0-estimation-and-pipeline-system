"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, FileText, Mail, Phone, Calendar, Edit, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { PipelineCard, PipelineStage } from "./pipeline-board"

interface PipelineCardDetailProps {
  card: PipelineCard
  stageId: string
  stages: PipelineStage[]
  onClose: () => void
  onMove: (toStageId: string) => void
}

export function PipelineCardDetail({ card, stageId, stages, onClose, onMove }: PipelineCardDetailProps) {
  const currentStage = stages.find((s) => s.id === stageId)

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-2.5 w-2.5 rounded-full ${currentStage?.color}`} />
            <Badge variant="secondary">{currentStage?.name}</Badge>
          </div>
          <SheetTitle className="text-xl">{card.customer}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Move to Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={stageId} onValueChange={onMove}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                        {stage.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{card.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">+91 98765 43210</span>
              </div>
            </CardContent>
          </Card>

          {/* Estimate Info */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Estimate</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/estimates/${card.estimateId}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{card.estimateId}</span>
                  {card.revisions > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      v{card.revisions + 1}
                    </Badge>
                  )}
                </div>
                <span className="text-lg font-bold text-foreground">{card.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {card.date}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Revise
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/estimates/${card.estimateId}`}>
                    <ArrowRight className="mr-2 h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about this deal..."
                defaultValue={card.notes}
                className="min-h-[100px]"
              />
              <Button size="sm" className="mt-3">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20">
                      <FileText className="h-3 w-3 text-info" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-foreground">Estimate sent</p>
                    <p className="text-xs text-muted-foreground">{card.date}</p>
                  </div>
                </div>
                {card.revisions > 0 && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/20">
                        <Edit className="h-3 w-3 text-warning" />
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-foreground">
                        Revised {card.revisions} time{card.revisions > 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">Latest: 1 day ago</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${currentStage?.color}/20`}>
                      <div className={`h-2 w-2 rounded-full ${currentStage?.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Moved to {currentStage?.name}</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
