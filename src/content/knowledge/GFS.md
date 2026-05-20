# Why Google Had To Reinvent The Filesystem

One thing I didn't really appreciate when I first started reading distributed systems papers is how many of them exist because traditional assumptions stopped working at scale.

Google File System (GFS) is probably one of the best examples of that.

At normal scale, filesystems are mostly boring. You read files, write files, maybe lock things occasionally, and the operating system handles the rest. But Google wasn't dealing with normal scale anymore. They were storing huge search indexes, crawling the web continuously, processing logs from massive distributed systems, and running MapReduce jobs across thousands of machines.

The assumptions traditional filesystems were designed around just stopped making sense there.

GFS is interesting because instead of trying to preserve normal filesystem behavior perfectly, Google basically asked:
> what assumptions can we intentionally relax to make large-scale distributed storage actually practical?

That shift in thinking changed a lot of distributed infrastructure that came later.

---

## The problem wasn't storage capacity

At first I assumed GFS existed because Google needed "more storage."

That's only partially true.

The real problem was:
- thousands of machines
- huge files
- constant hardware failures
- massive sequential reads
- append-heavy workloads
- distributed processing jobs running continuously

Traditional filesystems assumed:
- failures are relatively rare
- disks are mostly reliable
- metadata fits comfortably on one machine
- files are relatively small
- random reads/writes matter a lot

Google's workloads looked almost opposite.

They were dealing with:
- multi-GB files constantly
- machines failing all the time
- huge streaming reads
- log-style appends
- throughput mattering more than latency

Once you look at the workload like that, a lot of GFS design decisions start making more sense.

---

## Failures stopped being exceptional

This is probably the biggest mindset shift in the entire paper.

In smaller systems, failures are treated like unusual events.

In GFS-scale systems:
> failures are normal.

Not hypothetical.
Not edge cases.
Constant.

Disks fail.
Machines crash.
Network partitions happen.
Rack switches die.
Processes hang.

When you have thousands of commodity machines running continuously, something is always broken somewhere.

So instead of designing around:
> "how do we avoid failures?"

GFS designs around:
> "how do we recover automatically when failures happen?"

That difference changes the entire architecture.

---

## The basic GFS architecture

The architecture itself is surprisingly simple.

There are three main components:
- **Clients**
- **Chunkservers**
- **Master**

![GFS Architecture Diagram](/0*IJt3fn9VSg8NdkUP.jpg)

> add:
> classic GFS architecture diagram from the original paper  
> client ↔ master ↔ chunkservers

Files are split into large chunks (64MB by default), and those chunks are distributed across chunkservers.

The master stores metadata:
- namespace
- chunk locations
- replica information
- access permissions

The actual file data lives on chunkservers.

One thing I found interesting is that the master never becomes part of the actual data path for reads/writes after metadata lookup. Clients ask the master where chunks live, then communicate directly with chunkservers.

That avoids turning the master into a huge bandwidth bottleneck.

---

## Why the chunk size is so large

64MB chunks sounded absurdly large to me initially.

Normal filesystems usually use blocks measured in KBs.

But again, Google's workloads were weird.

Large chunks reduce:
- metadata size
- client-master communication
- network overhead
- number of chunk lookups

If a client is streaming through a huge file, you don't want it repeatedly asking the master for metadata every few KB.

Large chunks also make sequential reads much more efficient, which mattered a lot for MapReduce-style processing.

The downside is potential hotspotting if lots of clients hammer the same chunk simultaneously, but Google accepted that tradeoff because their workloads were mostly huge scans rather than millions of tiny random reads.

This is something I keep noticing in systems papers:
> a lot of architecture decisions only make sense once you understand the workload assumptions.

---

## Replication is the real reliability layer

GFS stores multiple replicas of each chunk across different machines.

Usually 3 replicas.

This is the actual fault tolerance mechanism.

If one chunkserver dies:
- the data still exists elsewhere
- the master detects the missing replica
- replication happens automatically

The interesting thing is that GFS assumes hardware failure will happen eventually, so redundancy isn't optional protection — it's part of normal operation.

That feels obvious now, but it was a pretty important systems design philosophy shift at the time.

---

## The append model is really important

One design decision that confused me initially was why GFS heavily optimized for appends instead of random overwrites.

Then I looked at Google's actual workloads:
- logs
- crawler outputs
- MapReduce intermediate data
- analytics pipelines

Most of these workloads mostly append new data continuously.

So GFS optimized for:
> "append lots of data reliably"

instead of:
> "support perfect POSIX-style random writes everywhere."

This is one of the places where GFS intentionally relaxes strict consistency guarantees.

Applications are expected to tolerate:
- duplicate records
- slightly inconsistent replicas temporarily
- relaxed mutation semantics

At first that sounded dangerous.

But honestly, for large distributed processing pipelines, throughput and recovery mattered more than perfect filesystem semantics.

Google basically traded strict correctness guarantees for scalability and operational simplicity.

A lot of distributed systems still make similar tradeoffs today.

---

## The master looks scary at first

The single master design initially feels like:
> isn't this a giant bottleneck?

And honestly, yes — somewhat.

But the paper explains why it worked reasonably well:
- metadata is relatively small
- operations are mostly large sequential reads
- clients cache metadata aggressively
- chunkservers handle actual data traffic

The master mostly coordinates.

Still, this limitation influenced later systems heavily.

HDFS inherited a similar architecture early on.
Modern distributed systems moved more toward decentralized metadata management partly because of bottlenecks like this.

It's interesting reading GFS now because you can already see the tradeoffs that later systems tried to solve differently.

---

## What GFS got really right

The thing I think GFS understood extremely well is this:

> distributed systems become infrastructure problems before they become algorithm problems.

A lot of the hard work wasn't:
- fancy algorithms
- complicated distributed consensus
- theoretical computer science

It was:
- recovery
- replication
- metadata management
- bandwidth optimization
- handling unreliable hardware
- minimizing operational complexity

Very practical engineering problems.

And honestly that feels very similar to modern large-scale ML infrastructure too.

Once systems become large enough, the bottlenecks start shifting toward:
- networking
- memory
- storage throughput
- fault tolerance
- scheduling
- hardware utilization

not just pure compute anymore.

---

## You can still see GFS ideas everywhere

Even though GFS itself is old now, a lot of its ideas basically shaped modern distributed infrastructure:
- HDFS
- Bigtable
- MapReduce
- Spark ecosystems
- distributed object stores
- modern ML data pipelines

Especially the idea that:
> failures are expected, so systems should recover automatically instead of pretending failures are rare.

That mindset shows up everywhere now.

Even modern distributed training systems for large models follow similar thinking:
- checkpointing
- replica recovery
- distributed storage
- sharded datasets
- append-heavy logging pipelines

Different domain, same systems pressures.

---

## One thing I liked about the paper

A lot of systems papers try to sound academically elegant.

GFS feels much more engineering-driven.

The paper repeatedly says things like:
- this workload mattered more
- this tradeoff was acceptable
- this bottleneck wasn't important in practice
- this assumption simplified recovery

That style of thinking honestly made distributed systems feel much more approachable to me.

Because the system isn't trying to be theoretically perfect.

It's trying to work reliably under real-world constraints.

And that distinction matters a lot once systems start getting large.