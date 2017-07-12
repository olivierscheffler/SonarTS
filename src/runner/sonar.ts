/*
 * SonarTS
 * Copyright (C) 2017-2017 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as ts from "typescript";
import { parseString } from "../utils/parser";
import getHighlighting from "./highlighter";
import getMetrics from "./metrics";
const chunks: string[] = [];

process.stdin.resume();
process.stdin.setEncoding("utf8");

const sensors: Array<(sourceFile: ts.SourceFile) => any> = [getHighlighting, getMetrics];

process.stdin.on("data", (chunk: string) => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  const inputString = chunks.join("");
  const input = JSON.parse(inputString);
  const sourceFile = parseString(input.fileСontent); // TODO manage ScriptKind
  const output: any = {};
  sensors.forEach(sensor => Object.assign(output, sensor(sourceFile)));
  const outputString = JSON.stringify(output, null, " ");
  process.stdout.setEncoding("utf8");
  process.stdout.write(outputString);
  process.stdout.write("\n");
});