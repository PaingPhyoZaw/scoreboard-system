"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"

export function TargetSettings() {
  const [targets, setTargets] = useState([
    {
      id: 1,
      role: "Engineer",
      monthlyTarget: 85,
      previousTarget: 80,
      yearlyTarget: 90,
    },
    {
      id: 2,
      role: "Service Admin",
      monthlyTarget: 80,
      previousTarget: 75,
      yearlyTarget: 85,
    },
    {
      id: 3,
      role: "Store",
      monthlyTarget: 75,
      previousTarget: 70,
      yearlyTarget: 80,
    },
    {
      id: 4,
      role: "Reception",
      monthlyTarget: 80,
      previousTarget: 75,
      yearlyTarget: 85,
    },
  ])

  const [editMode, setEditMode] = useState(false)
  const [editedTargets, setEditedTargets] = useState([...targets])

  const handleSave = () => {
    setTargets([...editedTargets])
    setEditMode(false)
  }

  const handleTargetChange = (id, field, value) => {
    const updatedTargets = editedTargets.map((target) => (target.id === id ? { ...target, [field]: value } : target))
    setEditedTargets(updatedTargets)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Target Settings</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (editMode) {
              handleSave()
            } else {
              setEditedTargets([...targets])
              setEditMode(true)
            }
          }}
          className="h-9"
        >
          {editMode ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {editMode ? "Save Changes" : "Edit Targets"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Role</TableHead>
              <TableHead>Previous Target</TableHead>
              <TableHead className="w-[300px]">Current Monthly Target</TableHead>
              <TableHead>Yearly Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(editMode ? editedTargets : targets).map((target) => (
              <TableRow key={target.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{target.role}</TableCell>
                <TableCell>{target.previousTarget}%</TableCell>
                <TableCell>
                  {editMode ? (
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[target.monthlyTarget]}
                        min={50}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleTargetChange(target.id, "monthlyTarget", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-medium">{target.monthlyTarget}%</span>
                    </div>
                  ) : (
                    <div>{target.monthlyTarget}%</div>
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[target.yearlyTarget]}
                        min={50}
                        max={100}
                        step={1}
                        onValueChange={(value) => handleTargetChange(target.id, "yearlyTarget", value[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-medium">{target.yearlyTarget}%</span>
                    </div>
                  ) : (
                    <div>{target.yearlyTarget}%</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
