"use client"

import { useState } from "react"
import { PipelineColumn } from "./pipeline-column"
import { PipelineCardDetail } from "./pipeline-card-detail"

export interface PipelineCard {
  id: string
  customer: string
  email: string
  estimateId: string
  amount: string
  date: string
  notes?: string
  revisions: number
}

export interface PipelineStage {
  id: string
  name: string
  color: string
  cards: PipelineCard[]
}

const initialStages: PipelineStage[] = [
  {
    id: "new",
    name: "New Estimate Sent",
    color: "bg-info",
    cards: [
      {
        id: "1",
        customer: "Acme Corp",
        email: "purchasing@acme.com",
        estimateId: "EST-001",
        amount: "$12,500",
        date: "2 hours ago",
        revisions: 1,
      },
      {
        id: "2",
        customer: "TechStart Inc",
        email: "jane@techstart.io",
        estimateId: "EST-002",
        amount: "$8,750",
        date: "5 hours ago",
        revisions: 0,
      },
      {
        id: "3",
        customer: "Quantum Labs",
        email: "orders@quantumlabs.io",
        estimateId: "EST-007",
        amount: "$18,200",
        date: "1 day ago",
        revisions: 0,
      },
    ],
  },
  {
    id: "negotiating",
    name: "Customer Negotiating",
    color: "bg-warning",
    cards: [
      {
        id: "4",
        customer: "Retail Plus",
        email: "mike@retailplus.co",
        estimateId: "EST-004",
        amount: "$5,200",
        date: "2 days ago",
        notes: "Customer wants 10% discount",
        revisions: 3,
      },
      {
        id: "5",
        customer: "FastTrade Co",
        email: "buy@fasttrade.com",
        estimateId: "EST-008",
        amount: "$32,000",
        date: "3 days ago",
        notes: "Discussing payment terms",
        revisions: 2,
      },
    ],
  },
  {
    id: "accepted",
    name: "Customer Accepted",
    color: "bg-success",
    cards: [
      {
        id: "6",
        customer: "Global Solutions",
        email: "orders@globalsolutions.com",
        estimateId: "EST-003",
        amount: "$24,000",
        date: "1 day ago",
        revisions: 2,
      },
      {
        id: "7",
        customer: "Metro Industries",
        email: "procurement@metro.com",
        estimateId: "EST-009",
        amount: "$15,600",
        date: "2 days ago",
        revisions: 1,
      },
    ],
  },
  {
    id: "rejected",
    name: "Customer Rejected",
    color: "bg-destructive",
    cards: [
      {
        id: "8",
        customer: "QuickServe",
        email: "orders@quickserve.net",
        estimateId: "EST-006",
        amount: "$2,100",
        date: "3 days ago",
        notes: "Budget constraints",
        revisions: 1,
      },
    ],
  },
  {
    id: "confirmed",
    name: "Order Confirmed",
    color: "bg-chart-4",
    cards: [
      {
        id: "9",
        customer: "BuildRight LLC",
        email: "procurement@buildright.com",
        estimateId: "EST-005",
        amount: "$45,800",
        date: "4 days ago",
        revisions: 0,
      },
    ],
  },
  {
    id: "processing",
    name: "Order Processing",
    color: "bg-primary",
    cards: [
      {
        id: "10",
        customer: "CoreTech Systems",
        email: "ops@coretech.io",
        estimateId: "EST-010",
        amount: "$28,500",
        date: "5 days ago",
        notes: "Sourcing materials",
        revisions: 1,
      },
      {
        id: "11",
        customer: "Sunrise Retail",
        email: "orders@sunrise.com",
        estimateId: "EST-011",
        amount: "$9,800",
        date: "6 days ago",
        notes: "Quality check pending",
        revisions: 0,
      },
    ],
  },
  {
    id: "completed",
    name: "Completed",
    color: "bg-muted-foreground",
    cards: [
      {
        id: "12",
        customer: "Alpha Enterprises",
        email: "admin@alpha.com",
        estimateId: "EST-012",
        amount: "$22,400",
        date: "1 week ago",
        revisions: 1,
      },
    ],
  },
]

export function PipelineBoard() {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages)
  const [selectedCard, setSelectedCard] = useState<PipelineCard | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const handleCardClick = (card: PipelineCard, stageId: string) => {
    setSelectedCard(card)
    setSelectedStage(stageId)
  }

  const handleMoveCard = (cardId: string, fromStageId: string, toStageId: string) => {
    setStages((prevStages) => {
      const newStages = [...prevStages]
      const fromStage = newStages.find((s) => s.id === fromStageId)
      const toStage = newStages.find((s) => s.id === toStageId)

      if (!fromStage || !toStage) return prevStages

      const cardIndex = fromStage.cards.findIndex((c) => c.id === cardId)
      if (cardIndex === -1) return prevStages

      const [card] = fromStage.cards.splice(cardIndex, 1)
      toStage.cards.push(card)

      return newStages
    })
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            onCardClick={handleCardClick}
            onMoveCard={handleMoveCard}
            allStages={stages}
          />
        ))}
      </div>

      {selectedCard && selectedStage && (
        <PipelineCardDetail
          card={selectedCard}
          stageId={selectedStage}
          stages={stages}
          onClose={() => {
            setSelectedCard(null)
            setSelectedStage(null)
          }}
          onMove={(toStageId) => {
            handleMoveCard(selectedCard.id, selectedStage, toStageId)
            setSelectedStage(toStageId)
          }}
        />
      )}
    </>
  )
}
